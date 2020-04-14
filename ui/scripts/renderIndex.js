const mapObject = require('./render-utils').mapObject

function renderIndex ({ types }) {
  return `import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import apolloClient from './apolloClient'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import './index.css'
import HomePage from './HomePage'
${mapObject(types, renderPageImport).join('\n')}
import * as serviceWorker from './serviceWorker'

function HApp () {
  return <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Switch>
${mapObject(types, renderRoute).join('\n')}
        <Route path='/' component={HomePage} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
}

ReactDOM.render(<HApp />, document.getElementById('root'))

serviceWorker.unregister()
`
}

function renderPageImport (typeName) {
  return `import ${typeName}sPage from './pages/${typeName}sPage'`
}

function renderRoute (typeName) {
  return `        <Route path='/${typeName.toLowerCase()}s' exact component={${typeName}sPage} />`
}

module.exports = renderIndex
