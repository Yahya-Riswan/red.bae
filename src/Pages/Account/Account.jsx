import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "./style.css"
import axios from 'axios'
import UserContext from '../../Context/UserContext'
import account from "../../Assets/account.jpg"
function Account() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext)

    const fileInputRef = useRef(null);
    useEffect(() => {
        const localuser = JSON.parse(localStorage.getItem("currentUser"));
        if (!localuser) {
            navigate("/Login");
        } else if(localuser.role === "admin"){
            navigate("/Admin/Dashboard")
        }else {
            setUser(localuser);
            axios.get(`http://localhost:5000/users/${localuser.id}`)
                .then((res) => setUser(res.data))
                .catch((err) => console.error("User fetch failed", err));
        }
    }, []);
    const onLogout = () => {
        localStorage.clear()
        setUser(null)
        navigate("/Login")
    }


    const handleImageClick = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                const updatedUser = { ...user, img: base64String };
                await axios.patch(`http://localhost:5000/users/${user.id}`, {
                    img: base64String
                });
                setUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            } catch (error) {
                console.error("Failed to update profile picture:", error);
            }
        };
    };
    return (
        <div className="account">
            {
                user &&
                <div className="account-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg, image/gif"
                    />
                    <img
                        src={user.img ? user.img : account}
                        alt="User profile"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                        title="Click to change profile picture"
                    />
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                    <pre>Last Logined : {user.last_logined}</pre>
                    <br />
                    <br />
                    <div className="navs">
                        <Link to={"/Orders"} className='btns'>Orders <div className="badge">{user.orders ? [...user.orders].length : 0}</div></Link>
                        <Link to={"/Cart"} className='btns'>Cart <div className="badge">{user.cart ? [...user.cart].length : 0}</div></Link>
                        <Link to={"/Wishlist"} className='btns'>Wishlist <div className="badge">{user.wishlist ? [...user.wishlist].length : 0}</div></Link>
                    </div>
                    <div className="pages">
                        {/* <Link to={"/Orders"} className='btns'>Address</Link>
                        <Link to={"/Cart"} className='btns'>Payment Methods</Link> */}
                        <button className='btns' onClick={onLogout}>Logout</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Account