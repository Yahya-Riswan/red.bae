import React, { useEffect, useState, useContext } from 'react';
import Review from '../../Components/Review/Review';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import heart from '../../Assets/icons8-love-48.png';
import LocalContext from '../../Context/LocalContext';
import AlertContext from '../../Context/AlertContext';
function Product({ id, img, title, price, desc, avgreview, refresh }) {
  const { setAlert, setAlertSt } = useContext(AlertContext)
  const navigate = useNavigate();
  const [wish, setWish] = useState(false);
  const { local, setLocal } = useContext(LocalContext);
  const to = `/Product/${id}`;

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const found = wishlist.some(item => item.id === id);
    setWish(found);
  }, [id]);


  const toggleWishlist = async () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    let updatedWishlist;
    if (wish) {
      updatedWishlist = wishlist.filter(item => item.id !== id);
    } else {
      updatedWishlist = [...wishlist, { id, img, title, price, desc, avgreview }];
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
      if (typeof refresh === "function") {
        refresh();
      }
    } catch (e) {
      console.error('Failed to update wishlist:', e);
      setAlert("Failed To Update  WishList.");
      setAlertSt("error")
    }
  };

  return (
    <div className="product" title={title}>
      <img
        src={heart}
        alt=""
        className={`heart ${wish ? 'true' : ''}`}
        onClick={toggleWishlist}
      />
      <Link to={to}>
        <img src={img} alt="" className="img" />
        <h1>{title}</h1>
        <h3>Rs. {price}</h3>
        <Review rating={Number(avgreview)} />
      </Link>
    </div>
  );
}

export default Product;
