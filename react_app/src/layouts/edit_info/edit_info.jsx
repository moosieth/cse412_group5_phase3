import React, { useState, useEffect } from "react";
import axios from "axios";
import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";
import "./edit_info.css";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';


export default function EditInfo() {
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
    const [requestData, setRequestData] = useState({
        target: "",
        userID: 0,
        changed: ""
    })
    const [user, setUser] = useState([]);
    const [target, setTarget] = useState("");
    const [changed, setChanged] = useState("");

    const handleInputChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === "dob") {
            value += "T00:00:00";
        }
        setFormData({ ...formData, [name]: value });
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    };

    const fetchInfo = async () => {
        const userID = getCookie("userID");

        const response = await axios.get("http://127.0.0.1:5000/userbyid", {
            params: { userID: userID },
        });

        setUser(response.data[0]);
        requestData.userID = userID;

    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/updateinfo", requestData)
                .then((reponse) => {
                    alert("Account Information Updated");
                })
                .catch((error) => {
                    alert("Something went wrong. Try again later");
                })
        } catch (error) {
            console.error(error);
        }
    };

    const handleReturn = () => {
        navigate("/social-network-service")
    }

    useEffect(() => {
        fetchInfo();
      }, []);

    return (
        <div className="create_form">
            <h1>Edit Account Information</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={user[1]}
                    name="fName"
                    value={formData.fName}
                    onChange={handleInputChange}
                    className="create_input"
                    required
                />
                <button onClick={() => {
                    requestData.target = "fName";
                    requestData.changed = formData.fName;
                    handleSubmit();
                }}>Change First Name</button>

                <input
                    type="text"
                    placeholder={user[2]}
                    name="lName"
                    value={formData.lName}
                    onChange={handleInputChange}
                    className="create_input"
                    required
                />
                <button onClick={() => {
                    requestData.target = "lName";
                    requestData.changed = formData.lName;
                    handleSubmit();
                }}>Change Last Name</button>

                <input
                    type="text"
                    placeholder={user[3]}
                    name="town"
                    value={formData.town}
                    onChange={handleInputChange}
                    className="create_input"
                />
                <button onClick={() => {
                    requestData.target = "town";
                    requestData.changed = formData.town;
                    handleSubmit();
                }}>Change Town</button>

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
                <button onClick={() => {
                    requestData.target = "gender";
                    requestData.changed = formData.gender;
                    handleSubmit();
                }}>Change Gender</button>

                <input
                    type="date"
                    placeholder={user[7]}
                    name="dob"
                    value={formData.dob.slice(0, 10)}
                    onChange={handleInputChange}
                    className="create_input"
                    required
                    max={new Date().toISOString().slice(0, 10)}
                    step="1"
                />
                <button onClick={() => {
                    requestData.target = "dob";
                    requestData.changed = formData.dob;
                    handleSubmit();
                }}>Change Date of Birth</button>

                <input
                    type="password"
                    placeholder="Password"
                    name="pw"
                    value={formData.pw}
                    onChange={handleInputChange}
                    className="create_input"
                    required
                />
                <button onClick={() => {
                    requestData.target = "pw";
                    requestData.changed = formData.pw;
                    handleSubmit();
                }}>Change First Name</button>
            </form>
            <button onClick={() => {
                    handleReturn();
                }}>Go Back</button>
        </div>
    );
}
