import React from 'react'
import "./style.css"
import { useNavigate } from 'react-router-dom'

function OrderItem({ data }) {
    let navigate = useNavigate()
    return (
        <div className="orderitem">
            <pre><span>Order Id :{data.id}</span><span>{data.status}</span></pre>
            <div className="items">
                {
                    data.items && data.items.map((item) => (
                        <div key={item.id} className="order">
                            <h4>{item.title}</h4>
                            <h4>×{item.quantity}</h4>
                            <h4>
                                <span>Rs. {item.price * item.quantity}</span> 
                            </h4>
                        </div>
                    ))
                }
            </div>
            <div className="datas">
                <h4>Payment Method : {data.paymentMethod} - {data.paymentValue}</h4>
                <h4>Amount Paid : Rs. {data.amount}</h4>
            </div>
            <pre className='pre'>{data.timestamp}</pre>
        </div>
    )
}

export default OrderItem