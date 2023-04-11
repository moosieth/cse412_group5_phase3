import React, { useState } from "react";
import axios from "axios";
import "./create.css";

export default function CreateAccount() {

    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        email: "",
        password: "",
        town: "",
        gender: "",
        dob: "",
    });
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:5000/register", formData);
            alert("Account created successfully!");
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

                <input
                    type="text"
                    placeholder="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="create_input"
                    required
                />

                <input
                    type="datetime-local"
                    placeholder="Date of Birth"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="create_input"
                    required
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="create_input"
                    required
                />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}
