import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from './Components/Navbar/Navbar';

function Admin() {
  return (
    <div className='admin' style={{width:'100%',display:'flex',flexDirection:'row'}}>
      <Navbar />
      <div id="divnavbar" style={{transition:'width 0.3s ease', width:'60px'}}></div>
      <Outlet />
    </div>
  )
}

export default Admin