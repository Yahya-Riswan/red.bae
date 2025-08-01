import React, { useContext } from 'react'
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import logo from "../../Assets/logo.png"
import cartimg from "../../Assets/icons8-cart-64.png"
import wishlistimg from "../../Assets/icons8-heart-64.png"
import user from "../../Assets/icons8-user-64.png"
import "./style.css"
import LocalContext from '../../Context/LocalContext'
function Header() {
  const {local} = useContext(LocalContext)
  return (
    <div className='header'>
        <div className="left">
            <CustomLink to="/"><img src={logo} alt="" className='logo'/></CustomLink>
            <CustomLink to="/UsedPc">Used Pc</CustomLink>
            <CustomLink to="/UsedLaptop" >Used Laptop</CustomLink>
            <CustomLink to="/PcParts" >Pc Parts</CustomLink>
            {/* <CustomLink to="/CustomPc" >Custom Pc</CustomLink> */}
        </div>
        <div className="right">
            {/* <CustomLink to="/Sell" >Sell</CustomLink>
            <CustomLink to="/Contact" >Contact</CustomLink> */}
            <CustomLink to="/WishList"><img src={wishlistimg} alt="" className='img'/><span>{local.wishlist?local.wishlist.length:""}</span></CustomLink>
            <CustomLink to="/Cart"><img src={cartimg} alt="" className='img'/><span>{local.cart?local.cart.length:""}</span></CustomLink>
            <CustomLink to="/Account"><img src={user} alt="" className='img'/></CustomLink>
        </div>
    </div>
  )
}
function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
      <Link to={to} {...props} className={isActive ? "link active" : "link "}>
        {children}
      </Link>
  )
}
export default Header