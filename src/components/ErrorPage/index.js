import React from "react";

import Container from "./styles/Container";

const ErrorPage = () => {
  return (
    <Container>
      <img alt="404" />
      <h2>
        Are You Lost? Click{" "}
        <a href="/" rel="noopener noreferrer" aria-label="home">
          here
        </a>{" "}
        to go home. 🏠
      </h2>
    </Container>
  );
};

export default ErrorPage;
