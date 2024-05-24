import { createRoot } from "react-dom/client";
import App from "./renderer/components/app";
import "./reset.css";
import "./index.css";

const root = createRoot(document.body);
root.render(<App />);
