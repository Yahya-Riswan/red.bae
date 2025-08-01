import React, { useEffect, useState } from 'react';
import './style.css';

function Review({ onChange , rate }) {
  const [rating, setRating] = useState(0);
  useEffect(()=>{
    setRating(rate)
  },[rate])
  const handleClick = (value) => {
    setRating(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={value <= rating ? 'star filled' : 'star'}
          onClick={() => handleClick(value)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default Review;
