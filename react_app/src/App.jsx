import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/login_page/login_page";
import SNS from "./components/sns_page/sns_page";
import CreateAccount from "./components/create_page/create_page";
import SearchResults from "./components/search_page/search";
import PhotoRecLanding from "./components/photo_rec/photo_rec_landing";
import FollowList from "./components/follow_list/follow_list";
import EditInfo from "./layouts/edit_info/edit_info";

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
        <Route path="/search" element={<SearchResults />} />
        <Route path="/youmaylike" element={<PhotoRecLanding />} />
        <Route path="/view-followed-friends" element={<FollowList />} />
        <Route path="/edit-my-profile" element={<EditInfo />} />
      </Routes>
    </Router>
  );
}
