import React, {Component} from 'react'

import Style from './../styles/style'
import PurchasesBar from '../components/PurchasesBar'
import CardBar from '../components/CardBar'

import {
  View
} from 'react-native'

export default class Main extends Component {
  render () {
    return (
      <View style={Style.rootContainer} onScroll={(event) => { this.offsetY = event.nativeEvent.contentOffset.y }}>
        <CardBar/>
        <PurchasesBar/>
      </View >
    )
  }
}
