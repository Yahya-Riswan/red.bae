import { Route, Routes } from "react-router-dom";
import Error from "../Admin/Pages/Error/Error";
import AlertContext from "../Context/AlertContext";
import { useEffect, useState } from "react";
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

function RoleAdmin() {

    const [alert, setAlert] = useState("");
    const [alertst, setAlertSt] = useState("");
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert("");
                setAlertSt("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <AlertContext.Provider value={{ alert, setAlert, alertst, setAlertSt }}>
            <ScrollToTop />
            {alert && <Alert state={alertst.toLowerCase()} content={alert} />}
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
