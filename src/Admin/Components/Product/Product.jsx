
import Review from '../../../Components/Review/Review';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import { useState } from 'react';
function Product({ id, img, title, price, status, change, remove }) {
  const navigate = useNavigate();


  const edit = () => {
    navigate(`/Admin/EditProduct/${id}`)
  }
  const detials = () => {
    navigate(`/Admin/ProductDetial/${id}`)
  }

  return (
    <>
      
      <div className="productdet" title={title}>
        <img src={img} alt="" className="img" />
        <h5 className='title'>{title}</h5>
        <h5>Rs. {price}</h5>
        <div className="buttons">
          <button className={`st ${status}`} onClick={change}>{status}</button>
          <button className="Edit" onClick={edit}>Edit</button>
          <button className="Remove" onClick={()=>{remove(id)}}>Remove</button>
          <button className="detials" onClick={detials}>Detials</button>
        </div>
      </div>
    </>
  );
}

export default Product;
