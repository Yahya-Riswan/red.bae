import React, { useEffect, useState } from 'react';
import Product from '../../Components/Product/Product';
import "./style.css"
function WishList() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    setProduct(JSON.parse(localStorage.getItem('wishlist')) || []);
  }, []);

  const update = () => {
    setProduct(JSON.parse(localStorage.getItem('wishlist')) || []);
  }

  return (
    <>
    <h2 className='h1wish'>My WishList</h2>
      <div className="wishlistdiv">
        {products.length > 0 ? (
          [...products].reverse().map(product => (
            <Product
              key={product.id}
              id={product.id}
              img={product.img}
              title={product.title}
              price={product.price}
              desc={product.desc}
              avgreview={product.avgreview}
              refresh={update}
            />
          ))
        ) : (
          <h2 className='h2wish'>No items in your wishlist. Add Some For Your Future Save...</h2>
        )}
      </div>
    </>
  );
}

export default WishList;
