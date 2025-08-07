import { Route, Routes, useNavigate, NavLink } from "react-router-dom";
import Error from "../Admin/Pages/Error/Error";
import AlertContext from "../Context/AlertContext";
import { useEffect, useState, useContext } from "react";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
import Alert from "../Components/Alert/Alert";
import Admin from "../Admin/Admin";
import Dashboard from "../Admin/Pages/Dashboard/Dashboard";
import Users from "../Admin/Pages/Users/Users";
import UserDetial from "../Admin/Pages/UserDetial/UserDetial";
import UsedPC from "../Admin/Pages/UsedPc/UsedPc";
import UsedLaptop from "../Admin/Pages/UsedLaptop/UsedLaptop"
import PcParts from "../Admin/Pages/PcParts/PcParts"
import CreateUser from "../Admin/Pages/CreateUser/CreateUser";
import CreateProduct from "../Admin/Pages/CreateProduct/CreateProduct";
import EditProduct from "../Admin/Pages/EditProduct/EditProduct";
import ProductDetials from "../Admin/Pages/ProductDetials/ProductDetials";
import Orders from "../Admin/Pages/Orders/Orders"
import logo from "../Assets/logo.png"
import menu from "../Assets/icons8-menu-50.png"
import "./Admin.css"
import AdminContext from '../Context/AdminContext';


import Homeimg from "../Admin/Assets/icons8-home-48.png"
import Orderimg from "../Admin/Assets/icons8-order-64.png"
import Usersimg from "../Admin/Assets/icons8-users-48.png"
import Pcimg from "../Admin/Assets/icons8-pc-48.png"
import Laptopimg from "../Admin/Assets/icons8-laptop-48.png"
import Partsimg from "../Admin/Assets/icons8-tools-64.png"
import logoutimg from "../Admin/Assets/icons8-logout-48.png"
function RoleAdmin() {
    const navigate = useNavigate()
    const [alert, setAlert] = useState("");
    const [alertst, setAlertSt] = useState("");
    const [sidebar, setSidebar] = useState(false);
    const { setAdmin } = useContext(AdminContext)
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert("");
                setAlertSt("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);
    // useEffect(()=>{
    //     let admin = sessionStorage.getItem("currentUser")
    //     if(!admin){
    //         navigate("/Login")
    //     }else{
    //         if(JSON.parse(admin).role !== "admin"){
    //             navigate("/Login")
    //         }
    //     }
    // })
    const Logout = () => {
        setAdmin([])
        localStorage.clear();
        sessionStorage.clear();
        navigate("/Login", { replace: true })
        window.location.reload();
    }
    return (
        <AlertContext.Provider value={{ alert, setAlert, alertst, setAlertSt }}>
            <ScrollToTop />
            {alert && <Alert state={alertst.toLowerCase()} content={alert} />}
            <div className="headers">
                <img src={menu} alt="" className="admenu" onClick={()=>setSidebar(!sidebar)}/>
                <div className="adlogo">
                    <img src={logo} alt="" />

                </div>
                <ul className={`menu ${sidebar}`}>
                    <div className="div">
                        <NavLink to={"/Admin/Dashboard"} onClick={()=>setSidebar(false)} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Homeimg} alt="" className="icon" /><span className="text">DashBoard</span></li></NavLink>
                        <NavLink to={"/Admin/Orders"} onClick={()=>setSidebar(false)} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Orderimg} alt="" className="icon invert" /><span className="text">Orders</span></li></NavLink>
                        <NavLink to={"/Admin/Users"} onClick={()=>setSidebar(false)} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Usersimg} alt="" className="icon invert" /><span className="text">Users</span></li></NavLink>
                        <NavLink to={"/Admin/UsedPc"} onClick={()=>setSidebar(false)} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Pcimg} alt="" className="icon invert" /><span className="text">Used Pc</span></li></NavLink>
                        <NavLink to={"/Admin/UsedLaptop"} onClick={()=>setSidebar(false)} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Laptopimg} alt="" className="icon" /><span className="text">Used Laptop</span></li></NavLink>
                        <NavLink to={"/Admin/PcParts"} onClick={()=>setSidebar(false)} className={({ isActive }) => isActive ? "active" : ""}><li><img src={Partsimg} alt="" className="icon invert" /><span className="text">Pc Parts</span></li></NavLink>
                    </div>
                    <li onClick={Logout}><img src={logoutimg} alt="" className="icon red" /><span className="text red">Logout</span></li>
                </ul>
            </div>
            <Routes>
                <Route path="/Admin" element={<Admin />} >
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="Users" element={<Users />} />
                    <Route path="Users/:userid" element={<UserDetial />} />
                    <Route path="CreateUser" element={<CreateUser />} />
                    <Route path="UsedPc" element={<UsedPC />} />
                    <Route path="UsedLaptop" element={<UsedLaptop />} />
                    <Route path="PcParts" element={<PcParts />} />
                    <Route path="CreateProduct/:type" element={<CreateProduct />} />
                    <Route path="EditProduct/:productid" element={<EditProduct />} />
                    <Route path="ProductDetial/:productid" element={<ProductDetials />} />
                    <Route path="Orders" element={<Orders />} />


                    <Route path="*" element={<Error />} />
                </Route>

            </Routes>
        </AlertContext.Provider >
    );
}

export default RoleAdmin;
