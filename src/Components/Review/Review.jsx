import React from 'react';
import './style.css'; 

function Review({ rating }) {
  const percentage = (rating / 5) * 100;
  return (
    <div className="stars-outer">
      <div className="stars-inner" style={{ width: `${percentage}%` }}></div>
    </div>
  );
}

export default Review;