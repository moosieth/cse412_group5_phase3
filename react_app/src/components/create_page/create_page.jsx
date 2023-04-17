import React, { useState } from "react";
import axios from "axios";
import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom"; 
import "./create.css";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';


export default function CreateAccount() {
  const history = createBrowserHistory(); 
  const navigate = useNavigate();
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
      navigate("/");
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
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <FormControlLabel
              value="M"
              control={<Radio color="primary" />}
              label="Male"
            />
            <FormControlLabel
              value="F"
              control={<Radio color="primary" />}
              label="Female"
            />
            <FormControlLabel
              value="O"
              control={<Radio color="primary" />}
              label="Other"
            />
          </RadioGroup>
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
