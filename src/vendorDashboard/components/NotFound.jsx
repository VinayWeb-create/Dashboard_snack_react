import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='errorSection'>
      <h1>404</h1>
      <div>Page not found</div>
      <Link to="/">← Go back home</Link>
    </div>
  )
}

export default NotFound
