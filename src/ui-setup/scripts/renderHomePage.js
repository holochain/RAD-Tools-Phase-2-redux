const mapObject = require('./render-utils').mapObject

function renderHomePage ({ types }) {
  return `import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage () {
  return <div className='index-page container'>
    <h3 className='title'>Welcome to your generated Happ UI</h3>
    <h5 className='subtitle'>Test all endpoints for each Zome Entry by clicking on the Entry Link below</h5>
${renderLinks(types)}
  </div>
}

export default HomePage
`
}

function renderLinks (types) {
  return `<div>
${mapObject(types, renderLink).join('\n')}
  </div>`
}

function renderLink (typeName) {
  const path = `/${typeName.toLowerCase()}`
  const text = `${typeName}`
  return `    <div className='type-page-link'><Link to='${path}'>${text}</Link></div>`
}

module.exports = renderHomePage
