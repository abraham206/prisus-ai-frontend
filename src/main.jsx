import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Nav from "./component/nav/nav.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./component/footer/footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      {/* <Footer /> */}
    </BrowserRouter>
  </StrictMode>,
);
