import React from "react";
import logo from "../../data/logo.png"
import { useNavigate } from "react-router-dom";
import { createBrowserHistory } from "history"; // install history
import { useState } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";
import "./login.css";

export default function Welcome() {
  const [loginSuccess, setLoginSuccess] = useState(null);
  const history = createBrowserHistory();
  const navigate = useNavigate();

  const handleLogin = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
      .get("http://127.0.0.1:5000/login", {
        params: { email, password },
      })
      .then((response) => {
        const userID = response.data[0][0];
        document.cookie = `userID=${userID}`;
        setLoginSuccess(true);
        navigate("/social-network-service");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setLoginSuccess(false);
        } else {
          console.error(error);
        }
      });
  };

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  return (
    <div className="login">
      <div className="wrapper">
        <img src={logo} alt="Sammy Image" width={300}  />
        {" "}
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("A brand new Group 5 SNS")
              .pauseFor(1000)
              .deleteAll()
              .start()
          }}
          options={{ loop: true }}
        />
      </div>
      <div className="login_form">
        <input type="text" placeholder="Please enter your email." id="email" />
        <input type="password" placeholder="Password" id="password" />
        <button className="login_btn" onClick={handleLogin}>
          Login
        </button>
        <span className="login_forgot_password"> Forgot password</span>
        <hr className="login_separator" />
        <button
          className="login_create_account_btn"
          onClick={handleCreateAccount}
        >
          Create an Account
        </button>
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
