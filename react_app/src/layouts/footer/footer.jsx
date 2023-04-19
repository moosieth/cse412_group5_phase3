import React from "react";
import logout from "../../data/logout.png";
import { useNavigate } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  const navigate = useNavigate();

  const deleteCookie = () => {
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handleLogout = () => {
    const logoutConfirmed = window.confirm("Are you sure you want to log out?");
    if (logoutConfirmed) {
      // Clear userID cookie
      deleteCookie();
      // Redirect to login page
      navigate("/");
    }
  };

  return (
    <footer style={{ display: "flex", alignItems: "center" }}>
      <p style={{ flex: 1 }}>&copy; {new Date().getFullYear()} INQL Social Network Service</p>
      <div className="logout_wrapper">
        <img src={logout} alt="Logout" className="logout" style={{ height: 20, width: 20, marginRight: 100 }} onClick={handleLogout} />
      </div>
    </footer>
  );
}
