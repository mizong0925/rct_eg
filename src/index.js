import * as serviceWorker from './serviceWorker';
import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);