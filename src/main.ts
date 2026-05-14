import { createApp } from "./app";
import "./styles/index.css";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("Missing #app root element.");
}

createApp(appRoot);
