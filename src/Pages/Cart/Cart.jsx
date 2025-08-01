import React, { useContext, useEffect, useState } from 'react'
import "./style.css"
import axios from 'axios'
import LocalContext from '../../Context/LocalContext'
import CartItems from '../../Components/CartItems/CartItems'
import {  useNavigate } from 'react-router-dom'

import AlertContext from '../../Context/AlertContext'



function Cart() {
    let navigate = useNavigate()
    const {  setLocal } = useContext(LocalContext);
    const {  setAlert, setAlertSt } = useContext(AlertContext);
    const [product, setProduct] = useState([]);
    const [dsdiv, setDsDiv] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [quantity, setQuantity] = useState(0);
    useEffect(() => {
        let data = JSON.parse(localStorage.getItem("cart"))||[]
        setProduct(data)
        let ts = 0
        let qs = 0
        for (let x of data) {
            ts += (Number(x.price) * x.quantity)
            qs += x.quantity
        }
        let amount = Math.round(ts + ((ts / 100) * 18))
        if (amount > 250000) {
            setDiscount((ts / 100) * 28);
            setDsDiv(5);
        } else if (amount > 200000) {
            setDiscount((ts / 100) * 20);
            setDsDiv(4);
        } else if (amount > 100000) {
            setDiscount((ts / 100) * 15);
            setDsDiv(3);
        } else if (amount > 50000) {
            setDiscount((ts / 100) * 12);
            setDsDiv(2);
        } else {
            setDiscount((ts / 100) * 10);
            setDsDiv(1);
        }
        setTotal(ts)
        setQuantity(qs)
    }, [])
    const updateTotal = () => {
        let data = JSON.parse(localStorage.getItem("cart"))
        let ts = 0
        let qs = 0
        for (let x of data) {
            ts += (Number(x.price) * x.quantity)
            qs += x.quantity
        }
        let amount = ts + ((ts / 100) * 18)
        if (amount > 250000) {
            setDiscount((ts / 100) * 28);
            setDsDiv(5);
        } else if (amount > 200000) {
            setDiscount((ts / 100) * 20);
            setDsDiv(4);
        } else if (amount > 100000) {
            setDiscount((ts / 100) * 15);
            setDsDiv(3);
        } else if (amount > 50000) {
            setDiscount((ts / 100) * 12);
            setDsDiv(2);
        } else {
            setDiscount((ts / 100) * 10);
            setDsDiv(1);
        }
        setTotal(ts)
        setQuantity(qs)
    }
    const updatedCart = async (data) => {
        try {
            localStorage.setItem("cart", JSON.stringify(data));
            setLocal(prev => ({ ...prev, cart: data }));
            const localUser = JSON.parse(localStorage.getItem("currentUser"));
            if (localUser?.id) {
                await axios.patch(`http://localhost:5000/users/${localUser.id}`, {
                    cart: data
                });
            }
            setProduct(data);
            updateTotal()
        } catch (e) {
            console.log(e)
        }
    }
    const updateItem = (itemid, data) => {
        const updated = product.map(p => p.id === itemid ? data : p);
        updatedCart(updated);
    };
    const removeItem = (itemid) => {
        const updated = product.filter(p => p.id !== itemid);
        updatedCart(updated);
        setAlert("Item Removed.")
        setAlertSt("success")
    };
    const Order=()=>{
        const localUser = JSON.parse(localStorage.getItem("currentUser"));
        if (localUser?.id) {
            sessionStorage.setItem("order_checkout_data",JSON.stringify(product))
            navigate("/Checkout")
        }else{
            navigate("/Login")
        }
        
    }
    return (
        <div className="cart">
            <h1>My Cart</h1>
            <div className="items">
                {
                    product && [...product].reverse().map((pr) => (
                        <CartItems key={pr.id} product={pr} updateItem={updateItem} removeItem={removeItem} />
                    ))
                }
                {
                    product.length < 1 &&
                    <div className="div">
                        <h2>No Products On Cart . Add Some Before You Go...</h2>
                    </div>
                }
                {
                    product.length > 0 &&
                    <div className="bill">
                        <div className="top">
                            <div className="left">
                                <h2><span>Items : </span>{product.length}</h2>
                                <h2><span>Quantity : </span>{quantity}</h2>
                                <h2><span>Total :</span> Rs. {total}</h2>
                            </div>
                            <div className="right">
                                <h2><span>Discount :</span> Rs. {Math.round(discount)}</h2>
                                <h2><span>Gst : </span>Rs. {Math.round((total / 100) * 18)} <span>(18%)</span></h2>
                                <h2><span>Amount :</span> Rs. {Math.round(total + ((total / 100) * 18) - discount)}</h2>
                            </div>
                        </div>
                        <div className="bottom">
                            {
                                dsdiv === 1 &&
                                <div className="discount">
                                    <h2>Discount Applied On Our Site Of 10% Of Total</h2>
                                </div>
                            }
                            {
                                dsdiv === 2 &&
                                <div className="discount">
                                    <h2>Discount Applied On Our Site Of 10% Of Total & Extra 2% Off</h2>
                                </div>
                            }
                            {
                                dsdiv === 3 &&
                                <div className="discount">
                                    <h2>Discount Applied On Our Site Of 10% Of Total & Extra 5% Off</h2>
                                </div>
                            }
                            {
                                dsdiv === 4 &&
                                <div className="discount">
                                    <h2>Discount Applied On Our Site Of 10% Of Total & Extra 10% Off</h2>
                                </div>
                            }
                            {
                                dsdiv === 5 &&
                                <div className="discount">
                                    <h2>Discount Applied On Our Site Of 10% Of Total & Extra 18% Off</h2>
                                </div>
                            }
                            <button onClick={Order}>Order & Pay Rs. {Math.round(total + ((total / 100) * 18) - discount)}</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}



export default Cart