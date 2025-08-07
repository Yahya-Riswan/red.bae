import React, { useContext, useEffect, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import './style.css';
import menu from "../../Assets/icons8-menu-50.png"
import logo from "../../Assets/logo.png"
import Home from "../../Assets/icons8-home-48.png"
import Order from "../../Assets/icons8-order-64.png"
import Users from "../../Assets/icons8-users-48.png"
import Pc from "../../Assets/icons8-pc-48.png"
import Laptop from "../../Assets/icons8-laptop-48.png"
import Parts from "../../Assets/icons8-tools-64.png"

import logout from "../../Assets/icons8-logout-48.png"
import AdminContext from '../../../Context/AdminContext';
const Navbar = () => {
    const { setAdmin } = useContext(AdminContext)
    const [open, setOpen] = useState(true);
    useEffect(() => {
    const navDiv = document.getElementById("divnavbar");

    if (!navDiv) return;

    if (window.innerWidth > 768) {
        navDiv.style.width = open ? "200px" : "60px";
    } else {
        navDiv.style.width = "0px";
    }
}, [open]);
    const navigate = useNavigate()
    
    const Logout = () => {
        setAdmin([])
        localStorage.clear();
        sessionStorage.clear();
        navigate("/Login", { replace: true })
        window.location.reload();
    }
    return (
        <div className={`sidebar ${open ? 'expanded' : 'collapsed'}`}>
            <div className="toggle-btn" onClick={() => setOpen(!open)}>
                <img src={menu} alt="" className='icon' />
                <img src={logo} alt="" className='text' />
            </div>
            <ul className="menul">
                <div>
                    <NavLink to={"/Admin/Dashboard"} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Home} alt="" className="icon invert" /><span className="text">DashBoard</span></li></NavLink>
                    <NavLink to={"/Admin/Orders"} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Order} alt="" className="icon" /><span className="text">Orders</span></li></NavLink>
                    <NavLink to={"/Admin/Users"} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Users} alt="" className="icon" /><span className="text">Users</span></li></NavLink>
                    <NavLink to={"/Admin/UsedPc"} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Pc} alt="" className="icon" /><span className="text">Used Pc</span></li></NavLink>
                    <NavLink to={"/Admin/UsedLaptop"} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Laptop} alt="" className="icon invert" /><span className="text">Used Laptop</span></li></NavLink>
                    <NavLink to={"/Admin/PcParts"} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Parts} alt="" className="icon" /><span className="text">Pc Parts</span></li></NavLink>
                </div>
                <li onClick={Logout}><img src={logout} alt="" className="icon red" /><span className="text red">Logout</span></li>
            </ul>
        </div>
    );
};

export default Navbar;
