import React from 'react'
import logo from "../../Assets/logo.png"
import upi from "../../Assets/upi.png"
import rupay from "../../Assets/RuPay.png"
import paytm from "../../Assets/paytm.png"
import bajaj from "../../Assets/bajaj.png"
import "./style.css"
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className="footer">
            <div className="top">
                <div className="left">
                    <img src={logo} alt="" className="img" />
                    <h4>We specialize in providing top-<br />
                        tier refurbished laptops, custom<br />
                        PCs, and quality components—<br />
                        crafted to deliver performance<br />
                        and value you can count on.</h4>
                </div>
                <div className="right">
                    <div className="shop">
                        <h1>Shop</h1>
                        <Link to={"/UsedPc"}>Used Pc</Link>
                        <Link to={"/UsedLaptop"}>Used Laptops</Link>
                        <Link to={"/PcParts"}>Pc Parts</Link>
                        {/* <h2>Custom PC</h2> */}
                    </div>
                    <div className="shop">
                        {/* <h1>Need Help?</h1>
                        <h2>Sell</h2>
                        <h2>FAQs</h2>
                        <h2>Shippings & Returns</h2>
                        <h2>Contact Us</h2> */}
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="left">
                    <h2>© 2025 Red.bae Store. Powered by Hash n Slash.</h2>
                </div>
                <div className="right">
                    <img src={upi} alt="" className="img" />
                    <img src={rupay} alt="" className="img" />
                    <img src={paytm} alt="" className="img" />
                    <img src={bajaj} alt="" className="img" />
                </div>
            </div>
        </div>
    )
}

export default Footer