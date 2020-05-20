import React from 'react'
import ReactDOM from 'react-dom'
import ReactModal from 'react-modal'
import { ApolloProvider } from '@apollo/react-hooks'
import apolloClient from './apolloClient'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import './index.css'
import HomePage from './HomePage'
import BookPage from './pages/BookPage'
import UserPage from './pages/UserPage'
import * as serviceWorker from './serviceWorker'

export function HApp () {
  return <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Switch>
        <Route path='/book' exact component={BookPage} />
        <Route path='/user' exact component={UserPage} />
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
