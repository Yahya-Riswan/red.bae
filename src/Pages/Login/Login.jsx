import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./style.css"
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import AlertContext from '../../Context/AlertContext';
import AdminContext from '../../Context/AdminContext';
function Login() {
    const { setAlert, setAlertSt } = useContext(AlertContext)
    const { admin, setAdmin } = useContext(AdminContext)

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext)
    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.password.trim()) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const lastLogined = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${day}-${month}-${year}`;
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await axios.get("http://localhost:5000/users");
            const user = res.data.find(
                (u) =>
                    u.email === form.email.trim() &&
                    u.password === form.password.trim()
            );

            if (user) {
                if (user.role === "admin") {
                    // sessionStorage.setItem("currentUser", JSON.stringify(user));
                    setAdmin(user)
                    setAlert("Logined Successfully");
                    setAlertSt("success");
                    navigate("/Admin/Dashboard");
                    return;
                }

                if (user.status !== "active") {
                    setErrors({ general: "Your account is blocked or deactivated." });
                    return;
                }

                const localCart = JSON.parse(localStorage.getItem("cart")) || [];
                const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

                const existingCart = Array.isArray(user.cart) ? user.cart : [];
                const existingWishlist = Array.isArray(user.wishlist) ? user.wishlist : [];

                const cartMap = new Map();
                [...existingCart, ...localCart].forEach(item => {
                    cartMap.set(item.id, item);
                });
                const mergedCart = Array.from(cartMap.values());

                const wishlistMap = new Map();
                [...existingWishlist, ...localWishlist].forEach(item => {
                    wishlistMap.set(item.id, item);
                });
                const mergedWishlist = Array.from(wishlistMap.values());

                const updatedUser = {
                    ...user,
                    cart: mergedCart,
                    wishlist: mergedWishlist,
                    last_logined: lastLogined()
                };

                await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);

                localStorage.setItem("cart", JSON.stringify(mergedCart));
                localStorage.setItem("wishlist", JSON.stringify(mergedWishlist));
                localStorage.setItem("orders", JSON.stringify(user.orders || []));
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));

                setUser(updatedUser);

                setAlert("Logined Successfully");
                setAlertSt("success");

                navigate("/Account");
            } else {
                setErrors({ general: "Invalid email or password" });
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ general: "Login failed. Please try again." });
            setAlert("Login failed. Please try again.");
            setAlertSt("error");
        }
    };




    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="top">
                    <Link to={"/"}><b>←</b> Go Back</Link>
                    <h2>Login</h2>

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
                    Login
                </button>

                <p className="signup-link">
                    Don’t have an account? <Link to="/SignUp">Signup here</Link>
                </p>
            </form>
        </div>
    )
}

export default Login