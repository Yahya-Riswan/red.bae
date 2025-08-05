import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./style.css"
import Review from '../../../Components/Review/Review';
import OrderItem from '../../Components/OrderItem/OrderItem';

function Product() {
    const { productid } = useParams();
    const [product, setProduct] = useState([]);
    const [image, setImage] = useState("");
    const [subdata, setSubData] = useState(1);
    const fetchProduct = async () => {
        try {
            let res = await axios.get(`http://localhost:5000/products/${productid}`)
            setProduct(res.data)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])
    useEffect(() => {
        setImage(product.image)
    }, [product]);
    const date = (timestamp)=>{
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    return (
        <>
            {
                product &&
                <div className="productdetpage">
                    <div className="maincontent">
                        <div className="left">
                            <img src={image} alt="" className="img" />
                        </div>
                        <div className="right">
                            <h2>{product.title}</h2>
                            <pre>{product.section}</pre>
                            <Review rating={product.avgreview} />
                            <span className='reviews'>
                                {product.review?.length || 0} Reviews
                            </span>
                            <h3>FREE DELIVERY ALL OVER INDIA</h3>
                            <h3>NO COST EMI AVAILABLE</h3>
                            <br></br>
                            <h2 className='price'>Rs. {product.price}</h2>
                            <h3>Uploaded Date : {date(product.timestamp)}</h3>
                        </div>
                    </div>
                    <div className="subcontent">
                        <div className="navs">
                            <button className={subdata === 1 ? 'active' : ''} onClick={() => setSubData(1)}>Description</button>
                            <button className={subdata === 2 ? 'active' : ''} onClick={() => setSubData(2)}>Reviews</button>
                            <button className={subdata === 3 ? 'active' : ''} onClick={() => setSubData(3)}>Orders</button>
                        </div>
                        <div className="content">
                            {
                                subdata === 1 &&

                                <div className="c1">
                                    <h3>{product.title}</h3>
                                    <p>{product.desc}</p>
                                </div>
                            }
                            {
                                subdata === 2 &&
                                <div className="c2">
                                    <h2>Reviews</h2>
                                    {
                                        product.review && product.review.map((rev) => (
                                            <div className="review" key={rev.username}>
                                                <Review rating={rev.rating} />
                                                <h3>{rev.title}</h3>
                                                <p>{rev.desc}</p>
                                                <br />
                                                <p>-{rev.username}</p>
                                            </div>
                                        ))
                                    }
                                    {
                                        !product.review &&
                                        <pre>No Reviews.</pre>
                                    }
                                </div>
                            }
                            {
                                subdata === 3 &&
                                 <div className="c3">
                                    <h2>Orders</h2>
                                    {
                                        product.orders && product.orders.map((rev) => (
                                            <OrderItem data={rev} />
                                        ))
                                    }
                                    {
                                        !product.orders || product.orders.length < 1 &&
                                        <pre>No Orders.</pre>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Product