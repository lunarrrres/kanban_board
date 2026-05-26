/**
 * Application Entry Point
 * Mounts React app to DOM
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import posthog from "posthog-js";
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "https://fb1e99c0e4e16f77941458e0e04c18a7@o4511453921738752.ingest.de.sentry.io/4511453923115088",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing: Записувати 100% транзакцій для моніторингу продуктивності.
  // У продакшені рекомендується зменшити це значення (наприклад, до 0.1), щоб уни
  tracesSampleRate: 1.0,
  // Важливо вказувати середовище, щоб відфільтрувати тестові помилки від реальних
  environment: "development", // Змініть на "production" при релізі
});
console.log("before posthog init");
posthog.init("phc_s3vN4rD27srZXi7WRKKY6SwcwRYQJVF7jvnqvNyQVPnn", {
  api_host: "https://app.posthog.com",
  person_profiles: "identified_only", // або 'always' для анонімних користув
});
console.log("after posthog init");

posthog.capture("test_event");
posthog.get_property("$token");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
