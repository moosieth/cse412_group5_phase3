import React, { useState } from "react";
import axios from "axios";
import { createBrowserHistory } from "history";
import "./create.css";

export default function CreateAccount() {
  const history = createBrowserHistory();
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    town: "",
    gender: "",
    pw: "",
    email: "",
    dob: "",
  });

  const handleInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "dob") {
      value += "T00:00:00";
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/register", formData);
      alert("Account created successfully!");
      history.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create_form">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          name="fName"
          value={formData.fName}
          onChange={handleInputChange}
          className="create_input"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lName"
          value={formData.lName}
          onChange={handleInputChange}
          className="create_input"
          required
        />

        <input
          type="text"
          placeholder="Town"
          name="town"
          value={formData.town}
          onChange={handleInputChange}
          className="create_input"
          required
        />

        <div className="gender_box">
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === "M"}
              onChange={handleInputChange}
              className="create_input"
              required
            />
            <span>Male</span>
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={formData.gender === "F"}
              onChange={handleInputChange}
              className="create_input"
              required
            />
            <span>Female</span>
          </label>
        </div>

        <input
            type="date"
            placeholder="Date of Birth"
            name="dob"
            value={formData.dob.slice(0, 10)}
            onChange={handleInputChange}
            className="create_input"
            required
            max={new Date().toISOString().slice(0, 10)}
            step="1"
        />

        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="create_input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="pw"
          value={formData.pw}
          onChange={handleInputChange}
          className="create_input"
          required
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
