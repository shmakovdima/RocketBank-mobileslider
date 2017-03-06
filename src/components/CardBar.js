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
    let startRotate = 0
    let startRotateSecond = 0
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
        startPosition = 6
        startOpacity = 0.2
        startRotateSecond = 0
        startScaleX = 0.98
        break
      case 4:
        startPosition = 0
        startOpacity = 0.1
        startRotateSecond = 0
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
      previousStep: 0
    }
  }

  componentWillReceiveProps () {
    const step = this.props.step
    const previousStep = this.state.previousStep
    const previousVertivalPosition = this.state.verticalPosition
    const previousRotate = this.state.rotate
    const previousOpacity = this.state.opacity
    const previousRotateSecond = this.state.rotateSecond
    const total = this.props.total
    const previousScaleX = this.state.scaleX
    const inversionPosition = this.state.inversionPosition
    const startRotate = this.state.startRotate
    const startRotateSecond = this.state.startRotateSecond
    const startVerticalPosition = this.state.startVerticalPosition
    const startOpacity = this.state.startOpacity
    const startScaleX = this.state.startScaleX
    const changeY = step - previousStep
    const heightViewport = win.height - win.width / 1.6
    const newVerticalStep = step - 100 * (inversionPosition - 3)

    let newVerticalPosition = previousVertivalPosition
    let newRotate = previousRotate
    let newOpacity = previousOpacity
    let newRotateSecond = previousRotateSecond
    let newScaleX = previousScaleX

    if (step <= 0) {
      if (inversionPosition === 0) {
        newVerticalPosition = startVerticalPosition + step * 1.4
      } else if (inversionPosition === 1) {
        newVerticalPosition = startVerticalPosition + step * 1.8
      } else {
        newVerticalPosition = startVerticalPosition + step
      }

      if (newVerticalPosition <= 0) {
        newVerticalPosition = 0
      }
    } else {

      if (inversionPosition === 0) {
        newVerticalPosition = startVerticalPosition + step * 3
      }

      if (inversionPosition === 1) {
        if (newVerticalPosition < heightViewport * 0.75) {
          newVerticalPosition = startVerticalPosition + step * 2.32
        } else {
          newVerticalPosition = heightViewport * 0.75 + (step - (heightViewport * 0.75 - startVerticalPosition) / 2.32) * 3
        }
      }
      if (inversionPosition === 2) {
        if (newVerticalPosition < heightViewport * 0.4) {
          newVerticalPosition = startVerticalPosition + step * 1.43
        } else {
          newVerticalPosition = heightViewport * 0.4 + (step - (heightViewport * 0.4 - startVerticalPosition) / 1.43) * 3.75
        }
      }

      if (inversionPosition > 2) {
        if (newVerticalStep > 0) {
          newVerticalPosition = startVerticalPosition + newVerticalStep * 0.5
          if (previousVertivalPosition >= 0.1 * heightViewport) {
            newVerticalPosition = startVerticalPosition + newVerticalStep * 1
          }
        }
      }

      const proportion = newVerticalPosition / heightViewport

      newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.2)) * (1 - startScaleX)

      if (inversionPosition === 0) {
        newRotate = startRotate + proportion * (95 - startRotate)
        newRotateSecond = startRotateSecond + proportion * proportion * (40 - startRotateSecond)
      }

      if (inversionPosition === 1) {
        newRotate = startRotate + proportion * (90 - startRotate)
        newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)
      }
      if (inversionPosition === 2) {
        newRotate = startRotate + proportion * (90 - startRotate)
        newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)
      }

      if (inversionPosition > 2) {
        newRotate = startRotate + proportion * (90 - startRotate)
        newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)
      }

      newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.4)) * (1 - startOpacity)

      if (inversionPosition > 1) {
        newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.2)) * (1 - startOpacity)
      }

      if (newScaleX >= 1) {
        newScaleX = 1
      }

      if (newOpacity >= 1) {
        newOpacity = 1
      }
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

    const stepBlock = {
      transform: [{ rotateX: stepRotate + 'deg'}, {perspective: 1000}, {rotateX: -stepRotateSecond + 'deg'}, {scaleX: stepScaleX}],
      top: stepVerticalPosition,
      opacity: stepOpacity
    }

    const stepAddView = {transform: [{rotateX: 120 - stepRotate + 'deg'}]}

    return (
      <View style={[Style.cardBar__item, stepBlock]}>
        <TouchableHighlight style={Style.cardBar__press} onPress={() => Actions.menucart()} underlayColor='transparent' activeOpacity={1}>
          <Image style={Style.cardBar__item__image} source={require('../../images/card.png')}/>
        </TouchableHighlight>
        <View style={[Style.cardBar__item__imageAddings, stepAddView]}></View>
      </View>
    )
  }
}
