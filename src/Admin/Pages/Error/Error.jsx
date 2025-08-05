import React from 'react'
import { Link } from 'react-router-dom'
import "./style.css"
function Error() {
  return (
    <div className="error">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/Admin/Dashboard" className='btn'>Go To Dashboard</Link>
    </div>
  )
}

export default Error