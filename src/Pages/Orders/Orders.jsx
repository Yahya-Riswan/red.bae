import React, { useEffect, useState } from 'react'
import "./style.css"
import OrderItem from '../../Components/OrderItem/OrderItem'
function Orders() {
    const [orders, setOrders] = useState([])
    useEffect(()=>{
        if(localStorage.getItem("orders")){
            setOrders(JSON.parse(localStorage.getItem("orders")))
        }
    },[])
  return (
    <div className="orders">
        <h1 className='h1order'>My Orders</h1>
        <div className="content">
            {
                orders && 
                orders.map((order)=>(
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