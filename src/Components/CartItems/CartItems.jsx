import React,{useState, useEffect} from 'react'
import removeicon from "../../Assets/icons8-remove-64.png"

function CartItems({ product, updateItem, removeItem }) {
    const [item, setItem] = useState(product)
    const [count, setcount] = useState(product.quantity > 10 ? 10 : product.quantity);

    useEffect(() => {
        const newItem = { ...product, quantity: count };
        setItem(newItem);
        updateItem(product.id, newItem);
    }, [count])
    return (
        <div className="cartitem">
            <img src={product.image} alt="" className="img" />
            <h3>{product.title}</h3>
            <div className="last">
                <h3 className='price'>Rs. {product.price} × {count}<br /> = Rs. {product.price * count}</h3>
                <div className="count">
                    <button onClick={() => { if (count !== 1) setcount(prev => prev - 1) }}>-</button>
                    <input
                        type="number"
                        name="count"
                        id="count"
                        className='no-arrows'
                        value={count}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setcount(value);
                            updateItem(product.id, { ...product, quantity: value });
                        }}
                    />
                    <button onClick={() => { if (count !== 10) setcount(prev => prev + 1) }}>+</button>
                </div>
            </div>
            <button className='removeicon' onClick={() => removeItem(product.id)}><img src={removeicon} alt="" /></button>
        </div>
    )
}

export default CartItems