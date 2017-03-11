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
for (let i = 0; i <= 7; i++) {
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
    // Позиция конца инерции в нижней позиции
    this.blockBottomPosition = 53

    this.bottomPosition = 65
    // Блок работы PanResponder
    this.stopPan = false
    // Длительность анимации инерции
    this.duration = 500
    // Разница между картами
    this.stepSlide = 40

    this.state = {
      dY: 0, // Текущая позиция
      prevY: 0 // Предыдущая позиция
    }
  }

  // Анимация инерции наверху
  _toStartTopPoint (blockTopPosition, totalDuration) {
    totalDuration = this.duration * totalDuration
    if (totalDuration > this.duration) totalDuration = this.duration

    this.stopPan = true

    let timePromise = new Promise((resolve, reject) => {
      let startTime = Date.now()

      let timer = setInterval(() => {
        let timePassed = Date.now() - startTime

        // Расчет текущей позиции
        let position = (this.blockTopPosition) * (totalDuration - timePassed) / totalDuration

        if (position >= 0) position = 0

        this.setState({
          dY: position,
          prevY: position
        })

        // Если время вышло, окончательно ставим в начальную позицию и возобновляем работу PanResponder
        if (timePassed >= totalDuration) {
          clearInterval(timer)
          resolve('success')
          return false
        }


      }, 20)
    })

    timePromise.then(
      success => {
        setTimeout(() => this.stopPan = false, 500)
        this.setState({
          prevY: 0,
          dY: 0
        })
      },
      error => alert('Ошибка в приложении, перезапустите')
    )
  }
  // Анимация инерции внизу
  _toStartBottomPoint (currentPosition, totalDuration) {
    totalDuration = this.duration * totalDuration
    if (totalDuration > this.duration) totalDuration = this.duration
    this.stopPan = true

    let timePromise = new Promise((resolve, reject) => {
      let startTime = Date.now()

      let timer = setInterval(() => {
        let timePassed = Date.now() - startTime

        // Если время вышло, окончательно ставим в начальную позицию и возобновляем работу PanResponder
        if (timePassed >= totalDuration) {
          clearInterval(timer)
          resolve('success')
          return
        }

        // Расчет текущей позиции
        let position = (this.bottomPosition - this.blockBottomPosition) * (totalDuration - timePassed) / totalDuration

        this.setState({
          dY: position,
          prevY: position
        })
      }, 20)

    })


  }

  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      // Начало Touch (dragstart)
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        this.setState({
          prevY: this.state.dY + gestureState.vy
        })
      },
      // Движение Touch (drag)
      onPanResponderMove: (evt, gestureState) => {
        let currentStep = this.state.prevY + gestureState.dy
        // Блок верхней позиции
        if ((currentStep <= this.blockTopPosition) && (this.stopPan !== true)) {
          this._toStartTopPoint(currentStep, currentStep / this.blockTopPosition)
          return false
        }
        // Блок нижней позиции
        else if ((currentStep - this.stepSlide * (dataCards.length)) + this.blockBottomPosition > 0) {
          this._toStartBottomPoint(currentStep, (currentStep - this.stepSlide * (dataCards.length) + this.blockBottomPosition) / (this.bottomPosition - this.blockBottomPosition))
          return false
        }
        // Если позиция блокирована
        else if (this.stopPan === true) {
          return false
        // Все нормально
        } else {
          this.setState({
            dY: currentStep
          })
        }
      },
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
      height: win.width / 1.6 + 90 + ((step < 0) ? step * 1.4 : 3.05 * step)
    }
    return (
      <Animated.View style={[ Style.cardBar, heightViewport ]} {...this._panResponder.panHandlers}>
        {
          dataCards.map((item, key) => {
            return (
              <View key={key}>
                <CardImage item={item} total={dataCards.length} position={key} stepSlide = {this.stepSlide} bottomPosition={this.bottomPosition} step={this.state.dY}/>
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
    this.total = this.props.total
    this.position = this.props.position
    this.inversionPosition = this.total - this.position - 1
    // Высота экрана с шагом
    this.heightViewport = win.height - win.width / 1.6

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

    // Выставляем значения
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
      previousStep: 0,
      initionVerticalPosition: null
    }
  }

  // Момент монтирования и обновления step
  componentWillMount () {
    this._setPosition()
  }
  componentWillReceiveProps () {
    this._setPosition()
  }

  _setVerticalPosition (startPoint, stepPoint, decreaseStep, localStep, maxOfBreakpoint, nextLocalStep, heightViewport) {
    let currentVerticalPosition = startPoint + (stepPoint - decreaseStep) * localStep

    if (currentVerticalPosition >= maxOfBreakpoint * heightViewport) {
      currentVerticalPosition = maxOfBreakpoint * heightViewport + (currentVerticalPosition - maxOfBreakpoint * heightViewport) / localStep * nextLocalStep
    }
    return currentVerticalPosition
  }

  _setPosition () {
    // Шаг
    let step = this.props.step

    if ((step == 0) && (initionVerticalPosition != null)) {
      alert('ok')
    }
    const changeY = step - previousStep
    // Предыдущие позиции
    const previousStep = this.state.previousStep
    const previousVerticalPosition = this.state.verticalPosition
    const previousRotate = this.state.rotate
    const previousOpacity = this.state.opacity
    const previousRotateSecond = this.state.rotateSecond
    const previousScaleX = this.state.scaleX
    // Перевернутая позиция
    const inversionPosition = this.inversionPosition
    const total = this.props.total
    // Стартовые условия
    const startRotate = this.state.startRotate
    const startRotateSecond = this.state.startRotateSecond
    const startVerticalPosition = this.state.startVerticalPosition
    const initionVerticalPosition = this.state.initionVerticalPosition
    const startScaleX = this.state.startScaleX
    let startOpacity = this.state.startOpacity

    const heightViewport = this.heightViewport
    const position = this.position
    const bottomPosition = this.props.bottomPosition

    const stepSlide = this.props.stepSlide

    const newVerticalStep = step - stepSlide * (inversionPosition) + 302

    //Дублируем предыдущие
    let newVerticalPosition = previousVerticalPosition
    let newRotate = previousRotate
    let newOpacity = previousOpacity
    let newRotateSecond = previousRotateSecond
    let newScaleX = previousScaleX

    if (step < 0) {
      newVerticalPosition = startVerticalPosition
      switch (inversionPosition) {
        case 0:
          newVerticalPosition += step * 1.4
          break
        case 1:
          newVerticalPosition += step * 1.8
          break
        case 2:
          newVerticalPosition += step * 2.2
          break
        case 3:
          newVerticalPosition = initionVerticalPosition
          newVerticalPosition += step
          console.log(newVerticalPosition)
          break
        default:
          console.log(newVerticalPosition)
          newVerticalPosition = initionVerticalPosition
          newVerticalPosition += step
          if ((newVerticalPosition > startVerticalPosition) && (inversionPosition < 3)) newVerticalPosition = startVerticalPosition
      }
    } else {
      let startPoint = startVerticalPosition
      let localStep = 0.16
      let decreaseStep = 0
      let stepPoint = (inversionPosition > 2) ? newVerticalStep : step

      // Если превысели брекпоинт (против белых прогалов на быстрой прокрутке - changeY)
      let maxOfBreakpoint = 0.08
      // Значение следующего шага
      let nextLocalStep = 0.8
      // разница между шагами

      switch (inversionPosition) {
        case 0:
          localStep = 3
          maxOfBreakpoint = 1
          nextLocalStep = 2.8

          if (newVerticalPosition >= heightViewport * 1) {
            startPoint = heightViewport * 1
            decreaseStep += (heightViewport * 1 - startVerticalPosition) / localStep
            localStep = 2.8
            maxOfBreakpoint = Infinity
          }
          break
        case 1:

          localStep = 2.1
          maxOfBreakpoint = 0.38
          nextLocalStep = 2.5

          if (newVerticalPosition >= heightViewport * 0.38) {
            startPoint = heightViewport * 0.38
            decreaseStep += (heightViewport * 0.38 - startVerticalPosition) / localStep
            localStep = 2.5
            maxOfBreakpoint = 0.7
            nextLocalStep = 2.9
          }

          if (newVerticalPosition >= heightViewport * 0.7) {
            startPoint = heightViewport * 0.7
            decreaseStep += (heightViewport * 0.32) / localStep
            localStep = 2.9
            maxOfBreakpoint = 0.8
            nextLocalStep = 3.85
          }

          if (newVerticalPosition >= heightViewport * 0.8) {
            startPoint = heightViewport * 0.8
            decreaseStep += (heightViewport * 0.1) / localStep
            localStep = 3.85
            maxOfBreakpoint = 0.9
            nextLocalStep = 4.45
          }

          if (newVerticalPosition >= heightViewport * 0.9) {
            startPoint = heightViewport * 0.9
            decreaseStep += heightViewport * 0.1 / localStep
            localStep = 4.45
            maxOfBreakpoint = 0.95
            nextLocalStep = 3.85
          }

          if (newVerticalPosition >= heightViewport * 0.95) {
            startPoint = heightViewport * 0.95
            decreaseStep += heightViewport * 0.05 / localStep
            localStep = 3.85
            maxOfBreakpoint = 1
            nextLocalStep = 1.9
          }

          if (newVerticalPosition >= heightViewport * 1) {
            startPoint = heightViewport * 1
            decreaseStep += heightViewport * 0.05 / localStep
            localStep = 1.9
            maxOfBreakpoint = Infinity
          }
          break
        case 2:
          localStep = 1.65
          maxOfBreakpoint = 0.5
          nextLocalStep = 3.9

          if (newVerticalPosition >= heightViewport * 0.5) {
            startPoint = heightViewport * 0.5
            decreaseStep += (heightViewport * 0.5 - startVerticalPosition) / localStep
            localStep = 3.9
            maxOfBreakpoint = 0.8
            nextLocalStep = 2.98
          }

          if (newVerticalPosition >= heightViewport * 0.8) {
            startPoint = heightViewport * 0.8
            decreaseStep += heightViewport * 0.3 / localStep
            localStep = 2.98
            maxOfBreakpoint = 0.9
            nextLocalStep = 2.1
          }

          if (newVerticalPosition >= heightViewport * 0.9) {
            startPoint = heightViewport * 0.9
            decreaseStep += heightViewport * 0.1 / localStep
            localStep = 2.1
            maxOfBreakpoint = Infinity
          }

          break
        default:
          if (newVerticalPosition >= heightViewport * 0.08) {
            decreaseStep = (heightViewport * 0.08 - startVerticalPosition) / localStep
            startPoint = heightViewport * 0.08
            localStep = 0.8
            maxOfBreakpoint = 0.15
            nextLocalStep = 1.6
          }

          if (newVerticalPosition >= heightViewport * 0.15) {
            decreaseStep += heightViewport * 0.07 / localStep
            startPoint = heightViewport * 0.15
            localStep = 1.6
            maxOfBreakpoint = 0.2
            nextLocalStep = 2.1
          }

          if (newVerticalPosition >= heightViewport * 0.2) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.2
            localStep = 2.1
            maxOfBreakpoint = 0.3
            nextLocalStep = 2.5
          }

          if (newVerticalPosition >= heightViewport * 0.3) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.3
            localStep = 2.5
            maxOfBreakpoint = 0.4
            nextLocalStep = 2.7
          }

          if (newVerticalPosition >= heightViewport * 0.4) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.4
            localStep = 2.7
            maxOfBreakpoint = 0.5
            nextLocalStep = 2.9
          }

          if (newVerticalPosition >= heightViewport * 0.5) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.5
            localStep = 2.9
            maxOfBreakpoint = 0.6
            nextLocalStep = 3.1
          }

          if (newVerticalPosition >= heightViewport * 0.6) {
            decreaseStep += heightViewport * 0.1 / localStep
            startPoint = heightViewport * 0.6
            localStep = 3.1
            maxOfBreakpoint = 0.75
            nextLocalStep = 3.1
          }

          if (newVerticalPosition >= heightViewport * 0.75) {
            decreaseStep += heightViewport * 0.15 / localStep
            startPoint = heightViewport * 0.75
            localStep = 3.1
            maxOfBreakpoint = 0.8
            nextLocalStep = 3.05
          }

          if (newVerticalPosition >= heightViewport * 0.8) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.8
            localStep = 3.05
            maxOfBreakpoint = 0.85
            nextLocalStep = 2.8
          }

          if (newVerticalPosition >= heightViewport * 0.85) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.85
            localStep = 2.8
            maxOfBreakpoint = 0.9
            nextLocalStep = 2.9
          }

          if (newVerticalPosition >= heightViewport * 0.9) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.9
            localStep = 2.9
            maxOfBreakpoint = 0.95
            nextLocalStep = 2.45
          }

          if (newVerticalPosition >= heightViewport * 0.95) {
            decreaseStep += heightViewport * 0.05 / localStep
            startPoint = heightViewport * 0.95
            localStep = 2.45
            maxOfBreakpoint = 0.98
            nextLocalStep = 2.1
          }

          if (newVerticalPosition >= heightViewport * 0.98) {
            decreaseStep += heightViewport * 0.03 / localStep
            startPoint = heightViewport * 0.98
            localStep = 2.1
            maxOfBreakpoint = Infinity
          }
      }

      newVerticalPosition = this._setVerticalPosition(startPoint, stepPoint, decreaseStep, localStep, maxOfBreakpoint, nextLocalStep, heightViewport)

      if (newVerticalPosition <= initionVerticalPosition) newVerticalPosition = initionVerticalPosition

      const proportion = newVerticalPosition / heightViewport

      newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.1)) * (1 - startScaleX)
      newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition - 20) / (heightViewport * 0.2)) * (1 - startOpacity)
      newRotate = startRotate + proportion * (90 - startRotate)
      newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)

      if (step - this.stepSlide * (total) + bottomPosition > 0) {
        newRotate = startRotate + proportion * (90 - startRotate) + 15 * (step - this.stepSlide * (total) + bottomPosition) / step
      }

      switch (position) {
        case 0:
          newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.1)) * (1 - startScaleX)
          newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition - 20) / (heightViewport * 0.05)) * (1 - startOpacity)
          if (newVerticalPosition > 10) newVerticalPosition = 10
          break
        case 1:
          if (newVerticalPosition > win.width / 1.6 - 60) newVerticalPosition = win.width / 1.6 - 60
          break
        case 2:
          if (newVerticalPosition > 2 * win.width / 1.6 - 155) newVerticalPosition = 2 * win.width / 1.6 - 155
          break
        case 3:
          if (newVerticalPosition > 3 * win.width / 1.6 - 280) newVerticalPosition = 3 * win.width / 1.6 - 280
          break
        case 4:
          if (newVerticalPosition > 4 * win.width / 1.6 - 435) newVerticalPosition = 4 * win.width / 1.6 - 440
          break
        default:
          if (newVerticalPosition > position * win.width / 1.6) newVerticalPosition = position * win.width / 1.6

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
      rotateSecond: newRotateSecond,
      initionVerticalPosition: ((initionVerticalPosition === null) && (step === 0)) ? newVerticalPosition : initionVerticalPosition
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
