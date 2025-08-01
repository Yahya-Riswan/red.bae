import React from 'react'
import { Link } from 'react-router-dom'
import "./style.css"
function Error() {
  return (
    <div className="error">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className='btn'>Go To Home</Link>
    </div>
  )
}

export default Error