import Sammy from "../img/sammy.jpeg";
import { useState } from "react";
import axios from "axios";
import "../css/login.css";

export default function Welcome() {
  const [loginSuccess, setLoginSuccess] = useState(null);

  const handleLogin = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
      .get("http://127.0.0.1:5000/login", {
        params: { email, password },
      })
      .then((response) => {
        setLoginSuccess(true);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setLoginSuccess(false);
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="login">
      <div className="wrapper">
        <h1>Welcome To My App</h1>
        <p>Group 5 SNS</p>
        <img src={Sammy} alt="Sammy Image" width={200} height={200} />
      </div>
      <div className="login_form">
        <input type="text" placeholder="Please enter your email." id="email" />
        <input type="password" placeholder="Password" id="password" />
        <button className="login_btn" onClick={handleLogin}>
          Login
        </button>
        <span className="login_forgot_password"> Forgot password</span>
        {loginSuccess === false && (
          <p style={{ color: "red" }}>User not found</p>
        )}
        {loginSuccess === true && (
          <p style={{ color: "green" }}>User found</p>
        )}
      </div>
    </div>
  );
}