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

// Генератор карт
let dataCards = []
for (let i = 0; i <= 20; i++) {
  dataCards[i] = {
    type: 'USD',
    value: '4000'
  }
}

// Общий класс секции карт
export default class PurchasesBar extends Component {
  constructor (props) {
    super(props)

    // Позиция конца инерции в верхней позиции
    this.blockTopPosition = -25
    // Блок работы PanResponder
    this.stopPan = false
    // Длительность анимации инерции
    this.duration = 500

    this.state = {
      dY: 0, // Текущая позиция
      prevY: 0
    }
  }

  // Анимация инерции наверх
  _toStartTopPoint (blockTopPosition, totalDuration) {
    totalDuration = this.duration * totalDuration
    this.stopPan = true

    let timePromise = new Promise((resolve, reject) => {
      let startTime = Date.now()

      let timer = setInterval(() => {
        let timePassed = Date.now() - startTime

        // Если время вышло, окончательно ставим в начальную позицию и возобновляем работу PanResponder
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

        // Расчет текущей позиции
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
      // Начало Touch (dragstart)
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        this.setState({
          prevY: this.state.dY + gestureState.vy
        })
      },
      // Движение Touch (drag)
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
      // Аналог event.stopPropagination
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx !== 0 && gestureState.dy !== 0
      },
      // Конец Touch (dragend)
      onPanResponderRelease: (evt, gestureState) => {
        if ((this.state.prevY + gestureState.dy <= 0) && (this.stopPan === false)) {
          this._toStartTopPoint(this.state.prevY + gestureState.dy, (this.state.prevY + gestureState.dy) / this.blockTopPosition)
          return false
        }
      }
    })
  }
  render () {
    // Текущий шаг
    const step = this.state.dY

    // Расчет высоты окна
    let heightViewport = {
      height: win.width / 1.6 + 90 + ((step < 0) ? step * 1.8 : 3.05 * step)
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

    // Переворачиваем позицию
    this.totalUnits = this.props.total
    this.position = this.props.position
    this.inversionPosition = this.totalUnits - this.position - 1

    // Стартовые условия
    let startPosition = 0
    let startOpacity = 0
    let startRotate = 10
    let startRotateSecond = 10
    let startScaleX = 0.9

    // Cтавим согласно дизайну первые карты
    switch (this.inversionPosition) {
      case 0:
        startPosition = 120
        startOpacity = 1
        startScaleX = 1
        break
      case 1:
        startPosition = 80
        startOpacity = 0.9
        startScaleX = 1
        break
      case 2:
        startPosition = 40
        startOpacity = 0.8
        startScaleX = 1
        break
      case 3:
        startOpacity = 0.2
        break
      case 4:
        startOpacity = 0.1
        break
      default:
        break
    }

    // Выставляем значени
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
      inversionPosition: this.inversionPosition,
      previousStep: 0,
      heightViewport: win.height - win.width / 1.6
    }
  }

  // Момент монтирования и обновления step
  componentWillMount () {
    this._setPosition()
  }
  componentWillReceiveProps () {
    this._setPosition()
  }


  _setPosition() {
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
    const changeY = step - previousStep
    let startOpacity = this.state.startOpacity
    const startScaleX = this.state.startScaleX
    const heightViewport = this.state.heightViewport

    const stepSlide = 40

    const newVerticalStep = step - stepSlide * (inversionPosition) + 302

    let newVerticalPosition = previousVerticalPosition
    let newRotate = previousRotate
    let newOpacity = previousOpacity
    let newRotateSecond = previousRotateSecond
    let newScaleX = previousScaleX

    if (step < 0) {
      newVerticalPosition = startVerticalPosition
      switch (inversionPosition) {
        case 0:
          newVerticalPosition += changeY * 1.4
          break
        case 1:
          newVerticalPosition += changeY * 1.8
          break
        case 2:
          newVerticalPosition += changeY * 2.2
          break
        default:
          newVerticalPosition += newVerticalPosition + changeY
      }

      if (newVerticalPosition <= 0) newVerticalPosition = 0

    } else {

      let startPoint = startVerticalPosition
      let localStep = 0.16
      let decreaseStep = 0
      let stepPoint = (inversionPosition > 2) ? newVerticalStep : step

      switch (inversionPosition) {
        case 0:
          localStep = 3

          if (newVerticalPosition >= heightViewport * 1) {
            startPoint = heightViewport * 1
            decreaseStep += (heightViewport * 1 - startVerticalPosition) / localStep
            localStep = 2.8
          }
          break
        case 1:

          localStep = 2.1

          if (newVerticalPosition >= heightViewport * 0.38) {
            startPoint = heightViewport * 0.38
            decreaseStep += (heightViewport * 0.38 - startVerticalPosition) / localStep
            localStep = 2.5
          }

          if (newVerticalPosition >= heightViewport * 0.7) {
            startPoint = heightViewport * 0.7
            decreaseStep += (heightViewport * 0.32) / localStep
            localStep = 2.9
          }

          if (newVerticalPosition >= heightViewport * 0.8) {
            startPoint = heightViewport * 0.8
            decreaseStep += (heightViewport * 0.1) / localStep
            localStep = 3.85
          }

          if (newVerticalPosition >= heightViewport * 0.9) {
            startPoint = heightViewport * 0.9
            decreaseStep += heightViewport * 0.1 / localStep
            localStep = 4.45
          }

          if (newVerticalPosition >= heightViewport * 0.95) {
            startPoint = heightViewport * 0.95
            decreaseStep += heightViewport * 0.05 / localStep
            localStep = 3.85
          }

          if (newVerticalPosition >= heightViewport * 1) {
            startPoint = heightViewport * 1
            decreaseStep += heightViewport * 0.05 / localStep
            localStep = 1.9
          }
          break
        case 2:
          localStep = 1.65

          if (newVerticalPosition >= heightViewport * 0.5) {
            startPoint = heightViewport * 0.5
            decreaseStep += (heightViewport * 0.5 - startVerticalPosition) / localStep
            localStep = 3.9
          }

          if (newVerticalPosition >= heightViewport * 0.8) {
            startPoint = heightViewport * 0.8
            decreaseStep += heightViewport * 0.3 / localStep
            localStep = 2.98
          }

          if (newVerticalPosition >= heightViewport * 0.9) {
            startPoint = heightViewport * 0.9
            decreaseStep += heightViewport * 0.1 / localStep
            localStep = 2.1
          }

          break
        default:

          if (newVerticalPosition >= heightViewport * 0.08) {
            decreaseStep = (heightViewport * 0.08 - startVerticalPosition) / localStep
            startPoint = heightViewport * 0.08
            localStep = 0.8
          }

          if (newVerticalPosition >= heightViewport * 0.15) {
            decreaseStep += heightViewport * 0.07 / localStep
            startPoint = heightViewport * 0.15
            localStep = 1.6
          }

          if (newVerticalPosition >= heightViewport * 0.2) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.2
            localStep = 2.1
          }

          if (newVerticalPosition >= heightViewport * 0.3) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.3
            localStep = 2.5
          }

          if (newVerticalPosition >= heightViewport * 0.4) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.4
            localStep = 2.7
          }

          if (newVerticalPosition >= heightViewport * 0.5) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.5
            localStep = 2.9
          }

          if (newVerticalPosition >= heightViewport * 0.6) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.6
            localStep = 3.1
          }

          if (newVerticalPosition >= heightViewport * 0.75) {
            decreaseStep += heightViewport * 0.15 / localStep
            startPoint = heightViewport * 0.75
            localStep = 3.1
          }

          if (newVerticalPosition >= heightViewport * 0.8) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.8
            localStep = 3.05
          }

          if (newVerticalPosition >= heightViewport * 0.85) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.85
            localStep = 2.8
          }

          if (newVerticalPosition >= heightViewport * 0.9) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.9
            localStep = 2.9
          }

          if (newVerticalPosition >= heightViewport * 0.95) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.95
            localStep = 2.45
          }

          if (newVerticalPosition >= heightViewport * 0.98) {
            decreaseStep += heightViewport * 0.03 / localStep
            startPoint = heightViewport * 0.98
            localStep = 2.1
          }
      }

      newVerticalPosition = startPoint + (stepPoint - decreaseStep) * localStep

      const proportion = newVerticalPosition / heightViewport

      newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.1)) * (1 - startScaleX)
      newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition - 20) / (heightViewport * 0.2)) * (1 - startOpacity)
      newRotate = startRotate + proportion * (90 - startRotate)
      newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)

      if (newScaleX >= 1) newScaleX = 1
      if (newOpacity >= 1) newOpacity = 1
      if (total - 1 === inversionPosition) newVerticalPosition = 0
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

    // Движение карты
    const stepBlock = {
      transform: [{ rotateX: stepRotate + 'deg'}, {perspective: 1000}, {rotateX: -stepRotateSecond + 'deg'}, {scaleX: stepScaleX}],
      top: stepVerticalPosition,
      opacity: stepOpacity
    }

    // Движение псевдо 3d (нет аналога css preserve3d в react-native)
    const stepAddView = {transform: [{rotateX: 130 - stepRotate + 'deg', opacity : stepVerticalPosition / heightViewport}]}

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
