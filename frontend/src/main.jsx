/**
 * Application Entry Point
 * Mounts React app to DOM
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import posthog from "posthog-js";
posthog.init("<ph_project_api_key>", {
  api_host: "<ph_instance_address>",
  person_profiles: "identified_only", // або 'always' для анонімних користув
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
