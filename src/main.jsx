import { StrictMode, React } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import CollectionsPage from "./CollectionsPage.jsx";
import TourGuidePage from "./TourGuidePage.jsx";
import AboutPage from "./AboutPage.jsx";
import LogIn from "./LogInPage.jsx";
import CheckToken from "./components/CheckToken.jsx";
import DatabasePage from "./DatabasePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/collections",
    element: <CollectionsPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/tourguide",
    element: <TourGuidePage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/about",
    element: <AboutPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: <LogIn />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/database",
    element: (
      <CheckToken>
        <DatabasePage />
      </CheckToken>
    ),
    errorElement: <div>404 Not Found</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <div>
    <RouterProvider router={router} />
  </div>
);
