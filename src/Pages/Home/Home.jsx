import React, { useEffect, useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import axios from "axios";
import amd from "../../Assets/amd.jpg"
import asus from "../../Assets/asus.png"
import coolermaster from "../../Assets/cooler master.png"
import corsair from "../../Assets/corsair.avif"
import gigabyte from "../../Assets/gigabyte.png"
import nvidia from "../../Assets/nvidia.png"
import intel from "../../Assets/intel.png"
import policy from "../../Assets/policy_banner.png"
import Product from '../../Components/Product/Product'
import Howwe from "../../Assets/how_banner.png"



function Home() {
    const [bestseller, setbestseller] = useState([])
    const [recent, setRecent] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/products");
                setbestseller(res.data);
                setRecent(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className='home'>
            <div className="spotlight">
                <h1>Enjoy Lag Free <br />Gaming Experience<br />With US...</h1>
                <Link to="/UsedPc"><div className="link"><h2>Explore Now...</h2><h5>Used Pc</h5></div></Link>
            </div>
            <div className="partners">
                <h2>Our Partners :</h2>
                <div className="imgs">
                    <img src={amd} alt="" />
                    <img src={intel} alt="" />
                    <img src={nvidia} alt="" />
                    <img src={gigabyte} alt="" />
                    <img src={coolermaster} alt="" />
                    <img src={corsair} alt="" />
                    <img src={asus} alt="" />
                </div>
            </div>
            <div className="line"></div>
            <div className="policy">
                <div className="left">
                    <img src={policy} alt="" />
                </div>
                <div className="right">
                    <h1>Our Policy</h1>
                    <h1>Your Trusted Source for Used & Custom PCs</h1>
                    <h3>We inspect, test, and refurbish every device to ensure quality and performance. All laptops and PCs come with a limited warranty and customer satisfaction guarantee. Whether you're a gamer, student, or business user — we've got you covered.</h3>
                </div>
            </div>
            <div className="line"></div>
            <div className="bestseller">
                <h1><span>Our Best Sellers</span> <Link to={"/bestsellers"} className='link'>View All</Link> </h1>
                <div className="products">
                    {bestseller.slice(0, 4).map((item) => (
                        <Product
                            key={item.id}
                            id={item.id}
                            img={item.image}
                            title={item.title}
                            price={item.price}
                            desc={item.desc}
                            avgreview={item.avgreview}
                        />
                    ))}
                </div>
            </div>
            <div className="line"></div>
            <div className="browse">
                <div className="left">
                    <h1>Browse Pc</h1>
                    <Link to="/UsedPc"><div className="link"><h2>SHOP PC</h2></div></Link>
                </div>
                <div className="right">
                    <h1>Browse Laptop</h1>
                    <Link to="/UsedLaptop"><div className="link"><h2>SHOP LAPTOP</h2></div></Link>
                </div>
            </div>
            <div className="line"></div>
            <div className="howwe">
                <h1>Reborn, Tested, Delivered — Here's How</h1>
                <img src={Howwe} alt="" />
            </div>
            <div className="line"></div>
            <div className="recent">
                <h1><span>Recent Uploads</span> <Link to={"/Recent"} className='link'>View All</Link> </h1>
                <div className="products">
                    {recent.slice(-4).reverse().map((ritem) => (
                        <Product
                            key={ritem.id}
                            id={ritem.id}
                            img={ritem.image}
                            title={ritem.title}
                            price={ritem.price}
                            desc={ritem.desc}
                            avgreview={ritem.avgreview}
                        />
                    ))}
                </div>
            </div>
            <div className="line"></div>
        </div>
    )
}

export default Home