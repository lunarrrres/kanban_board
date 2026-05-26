/**
 * AuthGate Component
 * Real backend-backed auth wrapper for the Kanban board.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import posthog from "posthog-js";
import Board from "../board/Board";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "kanban_auth_token";
const AUTH_USER_KEY = "kanban_user";

const readStoredSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = window.localStorage.getItem(AUTH_USER_KEY);

    if (!token || !userRaw) {
      return null;
    }

    const user = JSON.parse(userRaw);

    if (!user?.email || !user?.name) {
      return null;
    }

    return { token, user };
  } catch {
    return null;
  }
};

const saveSession = (token, user) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

const clearSession = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
};

const AuthGate = () => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      const storedSession = readStoredSession();

      if (!storedSession) {
        if (isActive) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${storedSession.token}` },
        });

        if (!isActive) {
          return;
        }

        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          clearSession();
        }
      } catch {
        if (isActive) {
          clearSession();
        }
      }

      if (isActive) {
        setIsCheckingSession(false);
      }
    };

    initialize();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (typeof posthog?.identify === "function") {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    if (typeof posthog?.capture === "function") {
      posthog.capture("user_authenticated", {
        user_id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleAuth = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Введіть email та пароль");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Введіть ім’я користувача");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      if (mode === "register") {
        payload.name = name.trim();
      }

      const response = await axios.post(`${API_BASE}${endpoint}`, payload);
      const { token, user } = response.data;

      saveSession(token, user);
      setUser(user);
      setPassword("");
      setName("");
    } catch (error) {
      setError(
        error.response?.data?.error || "Не вдалося виконати авторизацію"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setError("");
    setPassword("");
    setName("");
  };

  if (user) {
    return <Board user={user} onLogout={handleLogout} />;
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="max-w-md mx-auto rounded-2xl bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Kanban Board
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Підготовка авторизації…
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Перевіряю збережену сесію та доступ до бекенду.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500 mb-2">
          Kanban Board
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "login" ? "Увійдіть у систему" : "Створіть обліковий запис"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === "login"
            ? "Підключіть обліковий запис для доступу до дошки."
            : "Зареєструйтеся, щоб продовжити роботу з дошкою."}
        </p>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg px-4 py-2 font-semibold transition ${
              mode === "login"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Вхід
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg px-4 py-2 font-semibold transition ${
              mode === "register"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Реєстрація
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "register" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Ім’я
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ваше ім’я"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {isSubmitting
              ? "Триває авторизація..."
              : mode === "login"
                ? "Увійти"
                : "Зареєструватися"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthGate;
