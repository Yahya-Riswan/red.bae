import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./style.css"
import heart from "../../Assets/icons8-love-48.png"
import Review from '../../Components/Review/Review';
import LocalContext from '../../Context/LocalContext';

import img1 from "../../Assets/1.png";
import img2 from "../../Assets/2.png";
import AlertContext from '../../Context/AlertContext';
function Product() {
    let navigate = useNavigate()
    const { setAlert, setAlertSt } = useContext(AlertContext)
    const { setLocal } = useContext(LocalContext)
    const { productid } = useParams();
    const [wish, setWish] = useState(false)
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
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const found = wishlist.some(item => item.id === product.id);
        setWish(found);
        setImage(product.image)
    }, [product]);
    const addToCart = async () => {
        if (cartadded) {
            navigate("/Cart");
            return;
        }

        try {
            const cartString = localStorage.getItem("cart");
            const existingCart = cartString ? JSON.parse(cartString) : [];
            if (!product?.id) {
                console.error("Product ID is missing.");
                return;
            }

            let updatedCart;
            const existingProductIndex = existingCart.findIndex(
                item => String(item.id) === String(product.id)
            );

            if (existingProductIndex > -1) {
                updatedCart = [...existingCart];
                updatedCart[existingProductIndex].quantity += count;
            } else {
                const productToAdd = { ...product, quantity: count };
                updatedCart = [...existingCart, productToAdd];
            }

            const localUser = JSON.parse(localStorage.getItem("currentUser"));
            if (localUser?.id) {
                await axios.patch(`http://localhost:5000/users/${localUser.id}`, {
                    cart: updatedCart
                });
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setLocal(prev => ({ ...prev, cart: updatedCart }));
            setcardadded(true);
            setAlert("Added To Cart.");
            setAlertSt("success")
        } catch (e) {
            console.error("Failed to add item to cart:", e);
            setAlert("Failed To Add Item To Cart.");
            setAlertSt("error")

        }
    };
    const toggleWishlist = async () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        let updatedWishlist;
        if (wish) {
            updatedWishlist = wishlist.filter(item => item.id !== product.id);
        } else {
            updatedWishlist = [...wishlist, { ...product }];
        }

        try {
            const localUser = JSON.parse(localStorage.getItem('currentUser'));
            if (localUser?.id) {
                await axios.patch(`http://localhost:5000/users/${localUser.id}`, {
                    wishlist: updatedWishlist
                });
            }

            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            setLocal(prev => ({ ...prev, wishlist: updatedWishlist }));
            setWish(!wish);
            setAlert("Updated  WishList.");
            setAlertSt("success")
        } catch (e) {
            console.error('Failed to update wishlist:', e);
            setAlert("Failed To Update  WishList.");
            setAlertSt("error")
        }
    };
    const buynow = () => {
        const localUser = JSON.parse(localStorage.getItem("currentUser"));
        if (localUser?.id) {
            sessionStorage.setItem("order_checkout_data", JSON.stringify([{ ...product, quantity: count }]))
            navigate("/Checkout")
        } else {
            navigate("/Login")
        }
    }
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
                                onClick={toggleWishlist}
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
                            <button className="addcart" onClick={addToCart}>{cartadded ? "Go To Cart" : "Add To Cart"}</button><br />
                            <button className="buynow" onClick={buynow}>Buy Now</button>
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