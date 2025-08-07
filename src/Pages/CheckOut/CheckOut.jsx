import React, { useContext, useEffect, useState } from 'react'
import "./style.css"
import paytmscanner from "../../Assets/paytmscanner.jpeg"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocalContext from '../../Context/LocalContext';
import AlertContext from '../../Context/AlertContext';

function CheckOut() {

  let navigate = useNavigate()
  const { setLocal } = useContext(LocalContext);
  const { setAlert, setAlertSt } = useContext(AlertContext)
  const [orders, setOrders] = useState([])
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [pay, setPay] = useState(false);
  const [payment, setPayment] = useState("none")
  const [paymentval, setPaymentVal] = useState("")
  useEffect(() => {
    if (payment === "Upi Number" && paymentval.length > 10) {
      setPay(true)
    } else if (payment === "Paytm" && paymentval === "Paytm") {
      setPay(true)
    } else if (payment === "Debit Card" && paymentval.length === 19) {
      setPay(true)
    } else if (payment === "Bajaj Card" && paymentval.length === 19) {
      setPay(true)
    } else {
      setPay(false)
    }
  }, [paymentval, payment])
  useEffect(() => {
    setPaymentVal("")
  }, [payment])
  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem("order_checkout_data")) || []
    setOrders(data)
    console.log(data)
    let ts = 0
    let qs = 0
    for (let x of data) {
      ts += (Number(x.price) * x.quantity)
      qs += x.quantity
    }
    let amount = Math.round(ts + ((ts / 100) * 18))
    if (amount > 250000) {
      setDiscount((ts / 100) * 28);
    } else if (amount > 200000) {
      setDiscount((ts / 100) * 20);
    } else if (amount > 100000) {
      setDiscount((ts / 100) * 15);
    } else if (amount > 50000) {
      setDiscount((ts / 100) * 12);
    } else {
      setDiscount((ts / 100) * 10);
    }
    setTotal(ts)
    setQuantity(qs)
  }, [])

  const Order = async () => {
    const localUser = JSON.parse(localStorage.getItem("currentUser"));
    const checkoutOrders = JSON.parse(sessionStorage.getItem("order_checkout_data") || "[]");

    if (!localUser?.id) {
      navigate("/Login");
      return;
    }

    if (!payment || payment === "none") {
      setAlert("Please select a valid payment method.");
      setAlertSt("error");
      return;
    }

    if (!pay) {
      setAlert("Invalid or incomplete payment information.");
      setAlertSt("error");
      return;
    }

    try {
      // Fetch existing user
      const res = await axios.get(`http://localhost:5000/users/${localUser.id}`);
      const existingUser = res.data;
      const existingOrders = Array.isArray(existingUser.orders) ? existingUser.orders : [];

      // Create new order
      const newOrder = {
        id: Date.now().toString(), // or use uuid() if preferred
        items: checkoutOrders,
        timestamp: new Date().toISOString(),
        paymentMethod: payment,
        paymentValue: paymentval,
        amount: Math.round(total + ((total / 100) * 18) - discount),
        status: "Ordered",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email
        }
      };

      // Update user object with new order
      const updatedUser = {
        ...existingUser,
        cart: [],
        orders: [...existingOrders, newOrder]
      };

      // Save updated user
      await axios.put(`http://localhost:5000/users/${localUser.id}`, updatedUser);

      // Add order to orders DB
      await axios.post(`http://localhost:5000/orders`, newOrder);

      // Local cleanup
      localStorage.removeItem("cart");
      sessionStorage.removeItem("order_checkout_data");

      // LocalStorage: Add order to local 'orders' if any
      const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = [...localOrders, newOrder];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      // Context & UI
      setLocal(prev => ({ ...prev, cart: [] }));
      setAlert("Products Ordered.");
      setAlertSt("success");

      // Navigate to Orders
      navigate("/Orders");

    } catch (error) {
      setAlert("Order failed.");
      setAlertSt("error");
      console.error("❌ Order failed:", error);
    }
  };


  return (
    <div className="checkout">
      <h1 className='h1wish'>Confirm Your Order</h1>
      <div className="content">
        <div className="left">
          {
            orders && orders.map((order) => (
              <div key={order.id} className="order">
                <h3>{order.title}</h3>
                <h3>×{order.quantity}</h3>
                <h3>Rs. {order.price * order.quantity}</h3>
              </div>
            ))
          }
        </div>
        <div className="right">
          <div className="top">
            <h3>Bill Amount</h3>
            <h2><span>Items : </span>{orders.length}</h2>
            <h2><span>Quantity : </span>{quantity}</h2>
            <h2><span>Total :</span> Rs. {total}</h2>
            <h2><span>Discount :</span> Rs. {Math.round(discount)}</h2>
            <h2><span>Gst : </span>Rs. {Math.round((total / 100) * 18)} <span>(18%)</span></h2>
            <h2><span>Amount :</span> Rs. {Math.round(total + ((total / 100) * 18) - discount)}</h2>
          </div>
          <div className="paymentmethod">
            <select name="" id="" onChange={(e) => setPayment(e.target.value)} value={payment}>
              <option value="none" disabled>Select Payment Method</option>
              <option value="Upi Number">Upi Number</option>
              <option value="Paytm">Paytm Qr Code</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bajaj Card">Bajaj Card</option>
            </select>
            {
              payment === "Upi Number" &&
              <input type="text" name="upi" id="upi" className='pval' placeholder='Upi Id' value={paymentval} onChange={(e) => { setPaymentVal(e.target.value) }} />
            }
            {
              payment === "Paytm" &&
              <>
                <img src={paytmscanner} alt="" />
                <input type="button" name="upi" id="paytm" className='pval' placeholder='Upi Id' onClick={() => setPaymentVal("Paytm")} value={"Paid"} />
              </>

            }
            {
              payment === "Debit Card" &&
              <input type="text" name="debit" id="debit" className='pval' placeholder='____ ____ ____ ____' value={paymentval} onChange={(e) => { setPaymentVal(e.target.value) }} />
            }
            {
              payment === "Bajaj Card" &&
              <input type="text" name="debit" id="debit" className='pval' placeholder='____ ____ ____ ____' value={paymentval} onChange={(e) => { setPaymentVal(e.target.value) }} />
            }
          </div>
          <button className={`orderconf ${pay ? "true" : ''}`} onClick={Order}>Confirm Order</button>
        </div>
      </div>
    </div>
  )
}

export default CheckOut