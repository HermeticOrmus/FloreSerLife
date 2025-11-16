import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker, initInstallPrompt } from "./pwa-register";

// Register PWA service worker
registerServiceWorker();

// Initialize PWA install prompt
initInstallPrompt();

createRoot(document.getElementById("root")!).render(<App />);
