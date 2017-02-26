import React, {Component} from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Scene } from 'react-native-router-flux'

const logger = createLogger()
import * as reducers from '../reducers'
const reducer = combineReducers(reducers)
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddleware(reducer)

import Main from './Main.js'
import CardInfo from './CardInfo.js'

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router hideNavBar={'true'}>
          <Scene direction='leftToRight' component={Main} key='cardbar' title='List of Card' initial/>
          <Scene direction='horizontal' component={CardInfo} key='menucart' title='Card info' />
        </Router>
      </Provider>
    )
  }
}
