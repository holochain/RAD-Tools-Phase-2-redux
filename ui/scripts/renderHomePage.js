const mapObject = require('./render-utils').mapObject

function renderHomePage ({ types }) {
  return `import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage () {
  return <div className='home-page'>
    <h3>Welcome to your generated HApp</h3>
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
  const path = `/${typeName.toLowerCase()}s`
  const text = `${typeName}s`
  return `    <div className='type-page-link'><Link to='${path}'>${text}</Link></div>`
}

module.exports = renderHomePage
