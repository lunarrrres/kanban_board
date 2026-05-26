/**
 * Main App Component
 * Root component that sets up Redux provider and routing
 */

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import posthog from "posthog-js";
import store from "./redux/store";
import AuthGate from "./features/auth/AuthGate";
import "./index.css";

const FEATURE_FLAG_KEY = "kanban_essential_banner";

function App() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const syncFlag = () => {
      const flagValue = posthog?.getFeatureFlag?.(FEATURE_FLAG_KEY);
      setShowBanner(Boolean(flagValue));
    };

    syncFlag();

    if (typeof posthog?.onFeatureFlags === "function") {
      posthog.onFeatureFlags(syncFlag);
    }
  }, []);

  return (
    <>
      {showBanner && (
        <div className="w-full bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          Kanban Board - незамінний помічник у вашому проєкті
        </div>
      )}
      <Provider store={store}>
        <AuthGate />
      </Provider>
    </>
  );
}

export default App;
