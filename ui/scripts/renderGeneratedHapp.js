const mapObject = require('./render-utils').mapObject

function renderGeneratedHapp ({ types }) {
  return `import React from 'react'
import { Link } from 'react-router'
import './GeneratedHApp.css'

function GeneratedHApp () {
  return <div className='generated-happ'>
    <h3>Welcome to your generated HApp</h3>
${renderLinks(types)}
  </div>
}

export default GeneratedHApp
`
}

function renderLinks (types) {
  return mapObject(types, renderLink).join('\n')
}

function renderLink (typeName) {
  const path = `/${typeName.toLowerCase()}s`
  const text = `${typeName}s`
  return `    <Link to='${path}'>${text}</Link>`
}

module.exports = renderGeneratedHapp