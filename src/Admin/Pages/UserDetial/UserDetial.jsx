import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import image from "../../Assets/account.jpg"
import axios from 'axios';
import Product from "../../Components/Product/Product"
import OrderItem from '../../Components/OrderItem/OrderItem';
import AlertContext from '../../../Context/AlertContext';
import "./style.css"
function UserDetial() {
    let navigate = useNavigate()
    const { setAlert, setAlertSt } = useContext(AlertContext)
    const { userid } = useParams();
    const [user, setUser] = useState([])
    const [page, setPage] = useState(1)
    const callUser = async () => {
        try {
            let data = await axios.get(`http://localhost:5000/users/${userid}`)
            setUser(data.data)
        } catch (e) {
            console.log(e);

        }
    }
    useEffect(() => {
        callUser()
    }, [])
    const remove = async () => {
        try {
            let data = await axios.delete(`http://localhost:5000/users/${userid}`)
            setAlert("User Deleted Successfully");
            setAlertSt("success");
            navigate("/Admin/Users")
        } catch (e) {
            setAlert("Error Occured , Try Agian");
            setAlertSt("error");
            console.log(e);

        }
    }
    const userstatus = async () => {
        try {
            let status = user.status === 'active' ? 'non-active' : 'active';
            let data = { ...user, status: status };
            await axios.put(`http://localhost:5000/users/${user.id}`, data);
            callUser();
            setAlert(`User ${status === 'active' ? "Activated" : "Deactivated"}`);
            setAlertSt("success");
        } catch (e) {
            setAlert("Error Occured , Try Agian");
            setAlertSt("error");
            console.log(e);
        }
    };
    return (
        <div className="userdetial">
            <div className="detial">
                <pre>{user.id}</pre>
                <img src={user.img || image} alt="" className='profile' />
                <h2>{user.username}</h2>
                <h4>{user.email}</h4>
                <div className="timestamps">
                    <h4>Joined Date : </h4>
                    <pre>{user.joined_date}</pre>
                    <h4>Last Logined : </h4>
                    <pre>{user.last_logined}</pre>
                </div>
                <div className="buttons">
                    <button className={user.status} onClick={userstatus}>{user.status}</button>
                    {/* <button className='edit'>Edit</button> */}
                    <button className='remove' onClick={remove}>Remove</button>
                </div>
            </div>
            <div className="pages">
                <div className="navs">
                    <button className={page === 1 ? 'active' : ''} onClick={() => setPage(1)}>Orders</button>
                    <button className={page === 2 ? 'active' : ''} onClick={() => setPage(2)}>Cart</button>
                    <button className={page === 3 ? 'active' : ''} onClick={() => setPage(3)}>WishList</button>
                </div>
                <div className="page">
                    {
                        page === 1 &&
                        <div className="orders">
                            {
                                user.orders && [...user.orders].reverse().map((order) => (
                                    <OrderItem key={order.id} data={order} />
                                ))
                            }
                        </div>
                    }
                    {
                        page === 2 &&
                        <div className="carts">
                            {
                                user.cart?.map((item) => (
                                    <Product key={item.id} id={item.id} img={item.image} title={item.title} price={item.price} avgreview={item.avgreview} />
                                ))
                            }
                        </div>
                    }
                    {
                        page === 3 &&
                        <div className="wishlist">
                            {
                                user.wishlist?.map((item) => (
                                    <Product key={item.id} id={item.id} img={item.img} title={item.title} price={item.price} avgreview={item.avgreview} />
                                ))
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default UserDetial