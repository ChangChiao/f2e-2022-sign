import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Container } from "@chakra-ui/react";
function Default() {
  return (
    <>
      <Header />
      <Container mx={"auto"} w={"90%"}>
        <Outlet />
        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
}

export default Default;
