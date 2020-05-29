const mapObject = require('./render-utils').mapObject
const { capitalize } = require('../../setup/utils.js')

function renderHomePage ({ types }) {
  return `import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage () {
  return <div className='index-page container'>
    <div className='background' />
    <div className='background-overlay'>
      <h1 className='title'>Welcome to your generated Happ UI</h1>
      <h3 className='subtitle'>Test all endpoints for each Zome Entry by clicking on the Entry Link below</h3>
${renderLinks(types)}
    </div>
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
  const text = `${capitalize(typeName)}`
  return `        <div className='list-item'><Link className='list-text' to='${path}'>${text}</Link></div>`
}

module.exports = renderHomePage
