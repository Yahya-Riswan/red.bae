import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./style.css"
import heart from "../../../Assets/icons8-love-48.png"
import Review from '../../../Components/Review/Review';

import img1 from "../../../Assets/1.png";
import img2 from "../../../Assets/2.png";
function Product() {
    const { productid } = useParams();
    const [wish, setWish] = useState(true)
    const [product, setProduct] = useState([]);
    const [count, setcount] = useState(1);
    const [cartadded, setcardadded] = useState(false);
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

    return (
        <>
            {
                product &&
                <div className="productpage">
                    <div className="maincontent">
                        <div className="side">
                            <img src={product.image} alt="" className={`simg ${image === product.image ? "active" : ""}`} onClick={() => setImage(product.image)} />
                            <img src={img1} alt="" className={`simg ${image === img1 ? "active" : ""}`} onClick={() => setImage(img1)} />
                            <img src={img2} alt="" className={`simg ${image === img2 ? "active" : ""}`} onClick={() => setImage(img2)} />
                        </div>
                        <div className="left">
                            <img src={image} alt="" className="img" />
                            <img
                                src={heart}
                                alt=""
                                className={`heart ${wish ? 'true' : ''}`}
                            />
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
                            <div className="count">
                                <button onClick={() => { if (count !== 1) setcount(prev => prev - 1) }}>-</button>
                                <input type="number" name="count" id="count" className='no-arrows' value={count} onChange={(e) => setcount(e.target.value)} />
                                <button onClick={() => { if (count !== 10) setcount(prev => prev + 1) }}>+</button>
                                <h3>Rs. {count * Number(product.price)}</h3>
                            </div>
                            <button className="addcart">{cartadded ? "Go To Cart" : "Add To Cart"}</button><br />
                            <button className="buynow">Buy Now</button>
                        </div>
                    </div>
                    <div className="subcontent">
                        <div className="navs">
                            <button className={subdata === 1 ? 'active' : ''} onClick={() => setSubData(1)}>Description</button>
                            <button className={subdata === 2 ? 'active' : ''} onClick={() => setSubData(2)}>Reviews</button>
                            <button className={subdata === 3 ? 'active' : ''} onClick={() => setSubData(3)}>Shipping & Delivery</button>
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
                                    <h2>Shipping & Delivery</h2>
                                    <p>Orders placed before 11-30AM IST, on a business day will be shipped out the same day. All other orders will be shipped out the next business day. After your order is processed, transit time typically 3 to 4 business days, with delivery Monday-Saturday.</p>
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