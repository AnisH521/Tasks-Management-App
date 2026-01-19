import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="main-content">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
