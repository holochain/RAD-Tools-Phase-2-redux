import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage () {
  return <div className='index-page container'>
    <h3 className='title'>Welcome to your generated Happ UI</h3>
    <h5 className='subtitle'>Test all endpoints for each Zome Entry by clicking on the Entry Link below</h5>
<div>
    <div className='type-page-link'><Link to='/book'>Book</Link></div>
    <div className='type-page-link'><Link to='/user'>User</Link></div>
  </div>
  </div>
}

export default HomePage
