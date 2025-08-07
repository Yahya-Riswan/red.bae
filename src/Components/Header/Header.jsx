import React, { useContext, useState } from 'react'
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import logo from "../../Assets/logo.png"
import cartimg from "../../Assets/icons8-cart-64.png"
import wishlistimg from "../../Assets/icons8-heart-64.png"
import user from "../../Assets/icons8-user-64.png"
import "./style.css"
import LocalContext from '../../Context/LocalContext'
import menu from "../../Assets/icons8-menu-50.png"
function Header() {
  const { local } = useContext(LocalContext)
  const [sidebar, setSideBar] = useState(false)
  return (
    <>
      <div className='header'>
        <div className="left">
          <CustomLink to="/"><img src={logo} alt="" className='logo' /></CustomLink>
          <CustomLink to="/UsedPc">Used Pc</CustomLink>
          <CustomLink to="/UsedLaptop" >Used Laptop</CustomLink>
          <CustomLink to="/PcParts" >Pc Parts</CustomLink>

        </div>
        <div className="right">

          <CustomLink to="/WishList"><img src={wishlistimg} alt="" className='img' /><span>{local.wishlist ? local.wishlist.length : ""}</span></CustomLink>
          <CustomLink to="/Cart"><img src={cartimg} alt="" className='img' /><span>{local.cart ? local.cart.length : ""}</span></CustomLink>
          <CustomLink to="/Account"><img src={user} alt="" className='img' /></CustomLink>
        </div>
      </div>
      <div className="navbar">
        <img src={menu} onClick={()=>setSideBar(!sidebar)} alt="" className='menubtn'/>
        <CustomLink to="/" onClick={()=>setSideBar(false)}><img src={logo} alt="" className='logo' /></CustomLink>
        <div className="div">
          <CustomLink to="/WishList" onClick={()=>setSideBar(false)}><img src={wishlistimg} alt="" className='img' /><span>{local.wishlist ? local.wishlist.length : ""}</span></CustomLink>
          <CustomLink to="/Cart" onClick={()=>setSideBar(false)}><img src={cartimg} alt="" className='img' /><span>{local.cart ? local.cart.length : ""}</span></CustomLink>
          <CustomLink to="/Account" onClick={()=>setSideBar(false)}><img src={user} alt="" className='img' /></CustomLink>
        </div>
        <div className={`sidebar ${sidebar}`}>
          <CustomLink to="/UsedPc"onClick={()=>setSideBar(false)} ><span className="sidebtn">Used Pc</span></CustomLink>
          <CustomLink to="/UsedLaptop"onClick={()=>setSideBar(false)} ><span className="sidebtn">Used Laptop</span></CustomLink>
          <CustomLink to="/PcParts" onClick={()=>setSideBar(false)}><span className="sidebtn">Pc Parts</span></CustomLink>

        </div>

      </div>
    </>
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