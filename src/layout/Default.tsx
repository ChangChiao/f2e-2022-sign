import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Box, calc } from "@chakra-ui/react";
function Default() {
  return (
    <>
      <Header />
      <Box h="calc(100vh - 120px)">
        <Outlet />
        <ToastContainer />
      </Box>
      <Footer />
    </>
  );
}

export default Default;
