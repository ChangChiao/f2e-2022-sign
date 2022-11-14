import React from 'react'
import { matchPath, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
function Default() {
  return (
    <div>
        <Header />
        <Outlet />
        <Footer />
        <ToastContainer />
    </div>
  )
}

export default Default