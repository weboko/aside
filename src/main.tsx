import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WakuProvider } from "./components/WakuProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WakuProvider>
      <App />
    </WakuProvider>
  </React.StrictMode>,
);
