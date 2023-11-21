import React, { useState, useCallback, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import Spinner from "./components/Spinner";
import NavBarContainer from "./Containers/NavBar";
import ErrorPage from "./Containers/ErrorPage";

const Home = lazy(() => import("./Containers/HomePage/index"));

const About = lazy(() => import("./Containers/AboutPage/index"));

const Projects = lazy(() => import("./Containers/ProjectsPage/index"));

const HomePage = () => (
  <Suspense fallback={<Spinner />}>
    <Home />
  </Suspense>
);

const AboutPage = () => (
  <Suspense fallback={<Spinner />}>
    <About />
  </Suspense>
);

const ProjectsPage = () => (
  <Suspense fallback={<Spinner />}>
    <Projects />
  </Suspense>
);
const App = () => {
  const LightTheme = {
    bg: "#eee",
    fontColor: "#51595D",
    accentColor: "#007bff",
    projectColor: "#ffffff",
    projectShadow: "#00000015",
    projectShadowHover: "#b8b8d9",
  };

  const DarkTheme = {
    bg: "#161625",
    fontColor: "rgb(189, 189, 189)",
    accentColor: "#007bff",
    projectColor: "#1e1e30",
    projectShadow: "#000",
    projectShadowHover: "#000100",
  };

  const [isDarkTheme, setDarkTheme] = useState(
    localStorage.getItem("isDarkTheme") === "true"
  );
  const ThemeHandler = useCallback(
    (event) => {
      event.preventDefault();
      setDarkTheme(!isDarkTheme);
      localStorage.setItem("isDarkTheme", !isDarkTheme);
    },
    [isDarkTheme]
  );

  return (
    <ThemeProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
      <div className="App">
        <NavBarContainer {...{ isDarkTheme, ThemeHandler }} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
