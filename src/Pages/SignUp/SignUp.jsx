import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import UserContext from "../../Context/UserContext";
import axios from "axios";
import "./style.css";
import AlertContext from "../../Context/AlertContext";

const SignUp = () => {
  const { setAlert, setAlertSt } = useContext(AlertContext)
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(UserContext)
  let navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (form.username.trim().length < 3) err.username = "Min 3 characters";
    if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(form.email)) err.email = "Enter Gmail only";
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password))
      err.password = "6+ characters & a number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const JoinedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validate()) return;

    try {
      const { data } = await axios.get(`http://localhost:5000/users?email=${form.email}`);
      if (data.length) {
        setErrors({ email: "User already exists" });
        return;
      }

      const users = await axios.get("http://localhost:5000/users");
      const newUser = {
        ...form,
        img: "",
        id: form.username + String(users.data.length + 1),
        role: "user",
        status: "active",
        wishlist: [],
        cart: [],
        joined_date: JoinedDate(),
        last_logined: JoinedDate()
      };

      await axios.post("http://localhost:5000/users", newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setUser(newUser)
      setAlert("Registered Account Succefully");
      setAlertSt("success")
      navigate("/Account")
    } catch (err) {
      console.error(err);
      setAlert("Failed To Register Account");
      setAlertSt("error")
      // alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="top">
          <Link to={"/Login"}><b>←</b> Go Back</Link>
          <h2>SignUp</h2>

        </div>

        <div className={`input-box`}>
          <input
            className={errors.username ? "inperror" : ""}
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}

          />
          {errors.username && <p className="error-text">{errors.username}</p>}

        </div>
        <div className={`input-box`}>
          <input
            className={errors.email ? "inperror" : ""}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}

          />
          {errors.email && <p className="error-text">{errors.email}</p>}

        </div>
        <div className={`input-box`}>
          <input
            className={errors.password ? "inperror" : ""}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}

          />

          {errors.password && <p className="error-text">{errors.password}</p>}


        </div>

        {errors.general && <p className="error-text">{errors.general}</p>}

        <button type="submit" className="login-button">
          Sign Up
        </button>

        <p className="signup-link">
          Already have an account? <Link to="/Login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
