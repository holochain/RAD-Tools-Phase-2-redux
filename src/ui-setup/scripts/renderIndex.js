const mapObject = require('./render-utils').mapObject
const { capitalize } = require('../../setup/utils.js')

function renderIndex ({ types }) {
  return `import React from 'react'
import ReactModal from 'react-modal'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import apolloClient from './apolloClient'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import './index.css'
import HomePage from './HomePage'
${mapObject(types, renderPageImport).join('\n')}
import * as serviceWorker from './serviceWorker'

export function HApp () {
  return <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Switch>
${mapObject(types, renderRoute).join('\n')}
        <Route path='/' component={HomePage} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
}

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.render(<HApp />, rootElement)
  ReactModal.setAppElement('#root')
}

serviceWorker.unregister()
`
}

function renderPageImport (typeName) {
  return `import ${capitalize(typeName)}Page from './pages/${capitalize(typeName)}Page'`
}

function renderRoute (typeName) {
  return `        <Route path='/${typeName.toLowerCase()}' exact component={${capitalize(typeName)}Page} />`
}

module.exports = renderIndex
