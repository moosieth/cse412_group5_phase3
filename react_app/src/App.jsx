import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/login_page/login_page";
import SNS from "./components/sns_page/sns_page";
import CreateAccount from "./components/create_page/create_page";

function withAuthentication(WrappedComponent) {
  return function (props) {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop().split(";").shift();
      }
    };

    const userID = getCookie("userID");
    if (!userID) {
      return <Navigate to="/" />;
    }
    return <WrappedComponent {...props} />;
  };
}

const ProtectedSNS = withAuthentication(SNS);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/social-network-service" element={<ProtectedSNS />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}
