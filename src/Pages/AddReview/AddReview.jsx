import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./style.css"
import Rating from "../../Components/Rating/Rating"
import AlertContext from '../../Context/AlertContext';
function AddReview() {
    const { productid } = useParams()
    const { setAlert, setAlertSt } = useContext(AlertContext)
    let navigate = useNavigate()
    const [product, setProduct] = useState([]);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [more, setMore] = useState("");
    const [user, setUSer] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const callproduct = async () => {
            let data = await axios.get(`http://localhost:5000/products/${productid}`);
            setProduct(data.data);

            const existingReview = data.data.review?.find(r => r.userid === user?.id);
            if (existingReview) {
                setIsEditing(true);
                setRating(existingReview.rating);
                setTitle(existingReview.title);
                setMore(existingReview.desc);
            }
        };
        if (productid) {
            callproduct();
        }
    }, [productid, user?.id]);
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("currentUser"))?.id) {
            setUSer(JSON.parse(localStorage.getItem("currentUser")))
        } else {
            navigate("/Login")
        }
    }, [])
    const Rate = async () => {
        if (!rating) return setError("Give Some Stars . Just Click It...");
        if (!title) return setError("Give Some Title . For Stand Out ...");
        if (!more) return setError("Give Some About Product . Give Truthfully ...");

        try {
            const productRes = await axios.get(`http://localhost:5000/products/${productid}`);
            const existingProduct = productRes.data;
            const existingReviews = existingProduct.review || [];

            let updatedReviews;
            if (isEditing) {

                updatedReviews = existingReviews.map(r =>
                    r.userid === user.id
                        ? { ...r, rating, title, desc: more }
                        : r
                );
            } else {

                const newReview = {
                    rating,
                    title,
                    desc: more,
                    userid: user.id,
                    username: user.username,
                };
                updatedReviews = [...existingReviews, newReview];
            }
            const totalStars = updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0);
            const avgRating = (totalStars / updatedReviews.length).toFixed(1);
            console.log(avgRating)
            await axios.patch(`http://localhost:5000/products/${productid}`, {
                review: updatedReviews,
                avgreview: avgRating
            });

            const userRes = await axios.get(`http://localhost:5000/users/${user.id}`);
            const fullUser = userRes.data;

            const updatedOrders = fullUser.orders?.map(order => ({
                ...order,
                items: order.items.map(item => {
                    const updatedItem = item.id === productid
                        ? { ...item, review: true }
                        : item;

                    console.log("🟢 Updating item:", updatedItem);
                    return updatedItem;
                }),
            }));

            console.log(updatedOrders)
            await axios.patch(`http://localhost:5000/users/${user.id}`, {
                orders: updatedOrders,
            });

            localStorage.setItem("orders", JSON.stringify(updatedOrders))
            setIsEditing(false);
            setRating(0);
            setTitle("");
            setMore("");
            setAlert("Review Added SuccessFully.")
            setAlertSt("success")
            navigate("/Orders")
        } catch (err) {
            console.error(err);
            setAlert("Error submitting review. Try again.")
            setAlertSt("error")
            setError("❌ Error submitting review. Try again.");
        }
    };

    return (
        <div className="addreview">
            <div className="aproduct">
                <img src={product.image} alt="" />
                <h4><span>{product.title}</span>  <span>Rs. {product.price}</span></h4>
            </div>
            <div className="reviews">
                <Rating onChange={setRating} rate={rating} />
                <input type="text" name="title" id="title" placeholder='Give Review Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea name="" id="" rows="10" placeholder='Give More About ...' value={more} onChange={(e) => setMore(e.target.value)}></textarea>
                {error && <pre>{error}</pre>}
                <button onClick={Rate}>{isEditing ? "Update Rating" : "Rate"}</button>
            </div>
        </div>
    )
}

export default AddReview