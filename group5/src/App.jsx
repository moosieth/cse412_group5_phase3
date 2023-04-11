import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/login_page";
import SNS from "./components/sns_page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/social-network-service" element={<SNS />} />
      </Routes>
    </Router>
  );
}
