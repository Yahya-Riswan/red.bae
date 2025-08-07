import React, { useEffect, useState } from 'react'
import "./style.css"
import axios from 'axios'
import OrderItem from '../../Components/OrderItem/OrderItem'
function Orders() {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("currentUser"))?.id;
        axios.get(`http://localhost:5000/users/${userId}`)
            .then(res => {
                setOrders(res.data.orders);
            })
            .catch(err => console.error(err));
    }, [])
    return (
        <div className="orders">
            <h1 className='h1order'>My Orders</h1>
            <div className="content">
                {
                    orders &&
                    orders.map((order) => (
                        <OrderItem key={order.id} data={order} />
                    ))
                }
                {
                    orders.length < 1 &&
                    <h2 className='h2order'>No Orders . Order Some For Unforgettable Experiences...</h2>
                }
            </div>
        </div>
    )
}

export default Orders