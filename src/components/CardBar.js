import React, {Component} from 'react'
import Style from './../styles/style'

import { Actions } from 'react-native-router-flux'

const win = Dimensions.get('window')

import {
  View,
  TouchableHighlight,
  Image,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native'

let dataCards = []

for (let i = 0; i <= 20; i++) {
  dataCards[i] = {
    type: 'USD',
    value: '4000'
  }
}

export default class PurchasesBar extends Component {
  constructor (props) {
    super(props)

    this.blockTopPosition = -25
    this.stopPan = false

    this.state = {
      dY: 0,
      prevY: 0
    }
  }

  _toStartTopPoint (blockTopPosition, totalDuration) {
    totalDuration = 500 * totalDuration
    this.stopPan = true

    let timePromise = new Promise((resolve, reject) => {
      let startTime = Date.now()

      let timer = setInterval(() => {
        let timePassed = Date.now() - startTime

        if (timePassed >= totalDuration) {
          this.setState({
            blockPan: false,
            prevY: 0,
            dY: 0
          })
          clearInterval(timer)
          resolve('success')
          return
        }

        let position = (blockTopPosition) * (totalDuration - timePassed) / totalDuration

        if (position >= 0) position = 0

        this.setState({
          dY: position,
          prevY: position
        })
      }, 20)
    })
    timePromise.then(
      success => this.stopPan = false,
      error => alert('Ошибка в приложении, перезапустите')
    )
  }

  componentWillMount () {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        this.setState({
          prevY: this.state.dY + gestureState.vy
        })
      },
      onPanResponderMove: (evt, gestureState) => {
        if ((this.state.prevY + gestureState.dy <= this.blockTopPosition) && (this.stopPan !== true)) {
          this._toStartTopPoint(this.blockTopPosition, 1)
          return false
        } else if (this.stopPan === true) {
          return false
        } else {
          this.setState({
            dY: this.state.prevY + gestureState.dy
          })
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx !== 0 && gestureState.dy !== 0
      },
      onPanResponderRelease: (evt, gestureState) => {
        if ((this.state.prevY + gestureState.dy <= 0) && (this.stopPan === false)) {
          this._toStartTopPoint(this.state.prevY + gestureState.dy, (this.state.prevY + gestureState.dy) / this.blockTopPosition)
          return false
        }
      }
    })
  }
  render () {
    const step = this.state.dY

    let heightViewport = {
      height: win.width / 1.6 + 70 + ((step < 0) ? step * 1.8 : 3 * step)
    }
    return (
      <Animated.View style={[ Style.cardBar, heightViewport ]} {...this._panResponder.panHandlers}>
        {
          dataCards.map((item, key) => {
            return (
              <View key={key}>
                <CardImage item={item} total={dataCards.length} position={key} step={this.state.dY}/>
              </View>
            )
          })
        }
      </Animated.View>
    )
  }
}

class CardImage extends Component {
  constructor (props) {
    super(props)

    this._totalUnits = this.props.total
    this._position = this.props.position
    this._inversionPosition = this._totalUnits - this._position - 1

    let startPosition = 0
    let startOpacity = 0
    let startRotate = 10
    let startRotateSecond = 10
    let startScaleX = 0.9

    switch (this._inversionPosition) {
      case 0:
        startPosition = 100
        startOpacity = 1
        startRotate = 40
        startRotateSecond = 20
        startScaleX = 1
        break
      case 1:
        startPosition = 65
        startOpacity = 0.9
        startRotate = 20
        startRotateSecond = 15
        startScaleX = 1
        break
      case 2:
        startPosition = 20
        startOpacity = 0.7
        startRotate = 10
        startRotateSecond = 10
        startScaleX = 1
        break
      case 3:
        startPosition = 8
        startOpacity = 0.2
        startScaleX = 0.98
        break
      case 4:
        startPosition = 0
        startOpacity = 0.1
        startScaleX = 0.9
        break
      default:
        break
    }

    this.state = {
      verticalPosition: startPosition,
      startVerticalPosition: startPosition,
      rotate: startRotate,
      startRotate: startRotate,
      opacity: startOpacity,
      startOpacity: startOpacity,
      rotateSecond: startRotateSecond,
      startRotateSecond: startRotateSecond,
      scaleX: startScaleX,
      startScaleX: startScaleX,
      inversionPosition: this._inversionPosition,
      previousStep: 0,
      heightViewport: win.height - win.width / 1.6
    }
  }

  componentWillReceiveProps () {
    const step = this.props.step
    const previousStep = this.state.previousStep
    const previousVerticalPosition = this.state.verticalPosition
    const previousRotate = this.state.rotate
    const previousOpacity = this.state.opacity
    const previousRotateSecond = this.state.rotateSecond
    const total = this.props.total
    const previousScaleX = this.state.scaleX
    const inversionPosition = this.state.inversionPosition
    const startRotate = this.state.startRotate
    const startRotateSecond = this.state.startRotateSecond
    const startVerticalPosition = this.state.startVerticalPosition
    let startOpacity = this.state.startOpacity
    const startScaleX = this.state.startScaleX
    const changeY = step - previousStep
    const heightViewport = this.state.heightViewport


    const stepSlide = 60

    const newVerticalStep = step - stepSlide * (inversionPosition - 3)

    let newVerticalPosition = previousVerticalPosition
    let newRotate = previousRotate
    let newOpacity = previousOpacity
    let newRotateSecond = previousRotateSecond
    let newScaleX = previousScaleX

    if (step <= 0) {
      newVerticalPosition = startVerticalPosition

      switch (inversionPosition) {
        case 0:
          newVerticalPosition += step * 1.4
          break
        case 1:
          newVerticalPosition += step * 1.8
          break
        default:
          newVerticalPosition += step
      }

      if (newVerticalPosition <= 0) newVerticalPosition = 0

    } else {
      switch (inversionPosition) {
        case 0:
          newVerticalPosition = startVerticalPosition + step * 3
          break
        case 1:

          if (newVerticalPosition < heightViewport * 0.75)
            newVerticalPosition = startVerticalPosition + step * 2.32
          else
            newVerticalPosition = heightViewport * 0.75 + (step - (heightViewport * 0.75 - startVerticalPosition) / 2.32) * 3

          break
        case 2:

          if (newVerticalPosition < heightViewport * 0.4)
            newVerticalPosition = startVerticalPosition + step * 1.43
          else
            newVerticalPosition = heightViewport * 0.4 + (step - (heightViewport * 0.4 - startVerticalPosition) / 1.43) * 3.75
          break
        case 3:

          if (previousVerticalPosition < heightViewport * 0.15)
            newVerticalPosition = startVerticalPosition + step * 0.5
          else if (previousVerticalPosition > 0.75 * heightViewport)
            newVerticalPosition = heightViewport * 0.75 + (step - (heightViewport * 0.15 - startVerticalPosition) / 0.5 - (heightViewport * 0.6) / 4.1) * 5.3
          else
            newVerticalPosition = heightViewport * 0.15 + (step - (heightViewport * 0.15 - startVerticalPosition) / 0.5) * 4.1

          break
        default:
          console.log(newVerticalPosition)
          if ((newVerticalStep >= 0) && (newVerticalPosition < 0.1 * heightViewport)) {
            newVerticalPosition = startVerticalPosition + newVerticalStep * 0.5
          } else if ((newVerticalStep >= 0) && (newVerticalPosition >= heightViewport * 0.1) && (newVerticalPosition < heightViewport * 0.4)) {
            newVerticalPosition = heightViewport * 0.1 + (newVerticalStep - (heightViewport * 0.1 - startVerticalPosition) / 0.5) * 3
          } else {
            //
          }
      }

      if ((newVerticalStep + 60 > 0) && (inversionPosition > 3)) {
        startOpacity = 0.1
      } else {
        if (inversionPosition > 3) {
          startOpacity = 0
        }
      }

      const proportion = newVerticalPosition / heightViewport

      newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.1)) * (1 - startScaleX)
      newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.15)) * (1 - startOpacity)

      switch (inversionPosition) {
        case 0:
          newRotate = startRotate + proportion * (95 - startRotate)
          newRotateSecond = startRotateSecond + proportion * proportion * (40 - startRotateSecond)
          newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.4)) * (1 - startOpacity)
          break
        case 1:
          newRotate = startRotate + proportion * (90 - startRotate)
          newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)
          break
        case 2:
          newRotate = startRotate + proportion * (90 - startRotate)
          newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)
          break
        default:
          newRotate = startRotate + proportion * (90 - startRotate)
          newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)
      }

      if (newScaleX >= 1) newScaleX = 1
      if (newOpacity >= 1) newOpacity = 1
    }

    this.setState({
      previousStep: step,
      verticalPosition: newVerticalPosition,
      rotate: newRotate,
      opacity: newOpacity,
      scaleX: newScaleX,
      rotateSecond: newRotateSecond
    })
  }

  render () {
    const stepVerticalPosition = this.state.verticalPosition
    const stepRotate = this.state.rotate
    const stepOpacity = this.state.opacity
    const stepRotateSecond = this.state.rotateSecond
    const stepScaleX = this.state.scaleX
    const heightViewport = this.state.heightViewport

    const stepBlock = {
      transform: [{ rotateX: stepRotate + 'deg'}, {perspective: 1000}, {rotateX: -stepRotateSecond + 'deg'}, {scaleX: stepScaleX}],
      top: stepVerticalPosition,
      opacity: stepOpacity
    }

    const stepAddView = {transform: [{rotateX: 120 - stepRotate + 'deg', opacity : stepVerticalPosition / heightViewport}]}

    return (
      <View style={[Style.cardBar__item, stepBlock]}>
        <View style={[Style.cardBar__item__imageAddings, stepAddView]}></View>
        <TouchableHighlight style={Style.cardBar__press} onPress={() => Actions.menucart()} underlayColor='transparent' activeOpacity={1}>
          <Image style={Style.cardBar__item__image} source={require('../../images/card.png')}/>
        </TouchableHighlight>
      </View>
    )
  }
}
