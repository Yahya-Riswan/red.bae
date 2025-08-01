import { Route, Routes } from "react-router-dom"
import './App.css';
import Header from "./Components/Header/Header"
import Home from "./Pages/Home/Home";
import Error from "./Pages/Error/Error"
import AddProduct from "./Pages/AddProduct/AddProduct";
import Db from "./Db/Db";
import Footer from "./Components/Footer/Footer";
import UsedPc from "./Pages/UsedPc/UsedPc";
import UsedLaptop from "./Pages/UsedLaptop/UsedLaptop";
import PcParts from "./Pages/PcParts/PcParts";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import Account from "./Pages/Account/Account";
import Cart from "./Pages//Cart/Cart";
import UserContext from "./Context/UserContext"
import LocalContext from "./Context/LocalContext"
import AlertContext from "./Context/AlertContext"
import { useEffect, useState } from "react";
import Product from "./Pages/Product/Product";
import WishList from "./Pages/WishList/WishList";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import CheckOut from "./Pages/CheckOut/CheckOut";
import Orders from "./Pages/Orders/Orders";
import AddReview from "./Pages/AddReview/AddReview";
import Alert from "./Components/Alert/Alert";

function App() {
  const [user, setUser] = useState("")
  const [local, setLocal] = useState({})
  const [alert, setAlert] = useState("")
  const [alertst, setAlertSt] = useState("")
  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setLocal({ cart, wishlist })
  }, [])
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
        setAlertSt("")
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert])
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LocalContext.Provider value={{ local, setLocal }}>
        <AlertContext.Provider value={{ alert, setAlert, alertst, setAlertSt }}>
          <div className="App">
            <Header />
            <ScrollToTop />
            {
              alert &&
              <Alert state={alertst.toLocaleLowerCase()} content={alert} />
            }
            <div className="appcontent" >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Account" element={<Account />} />
                <Route path="/UsedPc" element={<UsedPc />} />
                <Route path="/UsedLaptop" element={<UsedLaptop />} />
                <Route path="/PcParts" element={<PcParts />} />
                <Route path="/Product/:productid" element={<Product />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/WishList" element={<WishList />} />
                <Route path="/CheckOut" element={<CheckOut />} />
                <Route path="/Orders" element={<Orders />} />
                <Route path="/AddReview/:productid" element={<AddReview />} />
                <Route path="/AddProduct" element={<AddProduct />} />
                <Route path="/database" element={<Db />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AlertContext.Provider>
      </LocalContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
