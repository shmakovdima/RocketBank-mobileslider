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
for (let i = 0; i <= 5; i++) {
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
    // Последний элемент сдвига вниз
    this.bottomPosition = 65
    // Блок работы PanResponder
    this.stopPan = false
    // Длительность анимации инерции
    this.duration = 500
    // Разница между картами
    this.stepSlide = 40

    // Для 4 карт
    if (dataCards.length === 4) {
      this.blockBottomPosition = 45
      this.bottomPosition = 60
    }
    // Менее 4 карт
    if (dataCards.length < 4) {
      this.blockBottomPosition = 20
      this.bottomPosition = 35
    }

    this.state = {
      dY: 0, // Текущая позиция
      prevY: 0 // Предыдущая позиция
    }
  }

  // Анимация инерции наверху
  _toStartTopPoint (blockTopPosition, totalDuration) {
    // Расчет времени + поправка на шаг
    totalDuration = this.duration * totalDuration
    if (totalDuration > this.duration) totalDuration = this.duration
    // Блок PanResponder
    this.stopPan = true

    let timePromiseTop = new Promise((resolve, reject) => {
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

    timePromiseTop.then(
      success => {
        // Небольшая задержка на повторный вызов
        setTimeout(() => this.stopPan = false, 500)
        // Выставление итоговой позиции
        this.setState({
          prevY: 0,
          dY: 0
        })
      },
      error => alert('Ошибка в приложении, перезапустите')
    )
  }
  // Анимация инерции внизу
  _toStartBottomPoint (currentStep) {
    // Блок PanResponder
    this.stopPan = true

    let timePromiseBottom = new Promise((resolve, reject) => {
      let startTime = Date.now()

      let timer = setInterval(() => {
        let timePassed = Date.now() - startTime

        // Расчет суммарного изменения высоты
        let positionStep = currentStep - this.stepSlide * (dataCards.length) + this.bottomPosition

        let position = positionStep * (timePassed / this.duration)

        if (position > positionStep) position = positionStep

        this.setState({
          dY: currentStep - position,
          prevY: currentStep - position
        })

        // Если время вышло, окончательно ставим в начальную позицию и возобновляем работу PanResponder
        if (timePassed >= this.duration) {
          clearInterval(timer)
          resolve('success')
          return false
        }
      }, 20)
    })

    timePromiseBottom.then(
      success => {
        setTimeout(() => this.stopPan = false, 500)
        this.setState({
          prevY: this.stepSlide * (dataCards.length) - this.blockBottomPosition,
          dY: this.stepSlide * (dataCards.length) - this.blockBottomPosition
        })
      },
      error => alert('Ошибка в приложении, перезапустите')
    )
  }

  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      // Начало Touch (dragstart)
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Блок - не стартуем
        if (this.stopPan === true) return false
        // Устанавливаем как предыдущая позиция
        this.setState({
          prevY: this.state.dY + gestureState.vy
        })
      },
      // Движение Touch (drag)
      onPanResponderMove: (evt, gestureState) => {
        // Изменение позиции
        let currentStep = this.state.prevY + gestureState.dy
        // Блок верхней позиции
        if ((currentStep <= this.blockTopPosition) && (this.stopPan !== true)) {
          // Запуск верхней инерции
          this._toStartTopPoint(currentStep, currentStep / this.blockTopPosition)
          return false
        }
        // Блок нижней позиции
        else if ((currentStep - this.stepSlide * (dataCards.length)) + this.bottomPosition > 0) {
          // Если больше - не двигаем
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
        // Не даем шаг в 0
        return gestureState.dx !== 0 && gestureState.dy !== 0
      },
      // Конец Touch (dragend)
      onPanResponderRelease: (evt, gestureState) => {
        // Если еще в блоке, то стоп
        if (this.stopPan === true) return false

        let currentStep = this.state.prevY + gestureState.dy
        // Старт верхней инерции
        if ((currentStep <= 0) && (this.stopPan === false)) {
          this._toStartTopPoint(currentStep, currentStep / this.blockTopPosition)
          return false
        // Старт Нижней инерции
        } else if ((currentStep - this.stepSlide * (dataCards.length)) + this.blockBottomPosition > 0) {
          this._toStartBottomPoint(this.stepSlide * (dataCards.length) - this.blockBottomPosition)
          return false
        // Сохраняем, если иначе
        } else {
          this.setState({
            dY: currentStep
          })
        }
      }
    })
  }
  render () {
    // Текущий шаг
    const step = this.state.dY

    // Отступ снизу относительно первой карты
    let constHeight = 90

    // Отступ снизу относительно первой карты, если меньше 4
    if (dataCards.length < 4) {
      constHeight = 40
    }

    // Смещение нижнего блока
    let stepHeightNextBlock = (step < 0) ? step * 1.4 : 3.00 * step

    // Поправки на кол-во карт
    if ((dataCards.length === 3) && (3 * step > dataCards.length * win.width / 1.6 - 460)) stepHeightNextBlock = dataCards.length * win.width / 1.6 - 460
    if ((dataCards.length === 2) && (3 * step > dataCards.length * win.width / 1.6 - 360)) stepHeightNextBlock = dataCards.length * win.width / 1.6 - 360

    // Выставляем высоту блока с картами
    let heightViewport = {
      height: (dataCards.length !== 1) ? win.width / 1.6 + constHeight + stepHeightNextBlock : win.width / 1.6
    }


    return (
      <Animated.View style={[ Style.cardBar, heightViewport ]} {...this._panResponder.panHandlers}>
        {
          dataCards.map((item, key) => {
            return (
              <View key={key}>
                <CardImage item={item} total={dataCards.length} position={key} stepSlide ={this.stepSlide} step={this.state.dY}/>
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

    // Поправки на кол-во карт
    if ((this.total === 5) && (this.inversionPosition === 4)) startOpacity = -0.15
    if (this.total === 3) {
      switch (this.inversionPosition) {
        case 0:
          startPosition = 80
          startOpacity = 1
          startScaleX = 1
          break
        case 1:
          startPosition = 40
          startOpacity = 0.9
          startScaleX = 1
          break
        default:
          startPosition = 0
          startOpacity = 0.8
          startScaleX = 1
          startRotate = 0
          break
      }
    }

    if (this.total === 2) {
      switch (this.inversionPosition) {
        case 0:
          startPosition = 40
          startOpacity = 1
          startScaleX = 1
          break
        case 1:
          startPosition = 0
          startOpacity = 0.9
          startScaleX = 1
          break
      }
    }

    if (this.total === 1) {
      startPosition = 15
      startOpacity = 1
      startScaleX = 1
      startRotateSecond = 7
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

  // Расчет высоты для step >= 0
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
    // Предыдущие позиции
    const previousVerticalPosition = this.state.verticalPosition
    const previousRotate = this.state.rotate
    const previousOpacity = this.state.opacity
    const previousRotateSecond = this.state.rotateSecond
    const previousScaleX = this.state.scaleX
    // Перевернутая позиция
    const inversionPosition = this.inversionPosition
    const position = this.position
    const total = this.props.total
    // Стартовые условия
    const startRotate = this.state.startRotate
    const startRotateSecond = this.state.startRotateSecond
    const startVerticalPosition = this.state.startVerticalPosition
    const initionVerticalPosition = this.state.initionVerticalPosition
    const startScaleX = this.state.startScaleX
    let startOpacity = this.state.startOpacity

    const heightViewport = this.heightViewport
    const stepSlide = this.props.stepSlide

    let changeOfStartCardPosition = 302

    // Шаг для нестартовых карт
    const newVerticalStep = step - stepSlide * (inversionPosition) + changeOfStartCardPosition

    // Нет движения для 1 карты
    if (total === 1) return false

    //Дублируем предыдущие
    let newVerticalPosition = previousVerticalPosition
    let newRotate = previousRotate
    let newOpacity = previousOpacity
    let newRotateSecond = previousRotateSecond
    let newScaleX = previousScaleX

    // Инерция снизу
    if (step < 0) {
      newVerticalPosition = startVerticalPosition
      switch (inversionPosition) {
        case 0:
          newVerticalPosition += step * 1.2
          break
        case 1:
          newVerticalPosition += step * 1.5
          if (total < 4) newVerticalPosition -= step * 0.7
          break
        case 2:
          newVerticalPosition += step * 1.8
          if (total < 4) newVerticalPosition -= step * 1.5
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
      // Пропорция положения/высоты экрана
      const proportion = newVerticalPosition / heightViewport

      // Поправка для 4 карт
      if (total !== 4) {
        newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.1)) * (1 - startScaleX)
      }
      // Выставление значений
      newRotate = startRotate + proportion * (90 - startRotate)
      newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)

    } else {

      // Стартовые коэффициенты
      let startPoint = startVerticalPosition
      let localStep = 0.16
      let decreaseStep = 0
      let stepPoint = (inversionPosition > 2) ? newVerticalStep : step

      // Если превысели брекпоинт (против белых прогалов на быстрой прокрутке - changeY)
      let maxOfBreakpoint = 0.08
      // Значение следующего шага
      let nextLocalStep = 0.8
      // разница между шагами

      // Варианты коэффициентов для различных карт
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

      // Финальный расчет высоты
      newVerticalPosition = this._setVerticalPosition(startPoint, stepPoint, decreaseStep, localStep, maxOfBreakpoint, nextLocalStep, heightViewport)

      // Если ушли за step < 0 выставить первоначальные значения из сохранения при старте
      if (newVerticalPosition <= initionVerticalPosition) newVerticalPosition = initionVerticalPosition

      // Установки поворота, размера, прозрачности, второго поворота
      const proportion = newVerticalPosition / heightViewport
      newScaleX = startScaleX + ((newVerticalPosition - startVerticalPosition) / (heightViewport * 0.1)) * (1 - startScaleX)
      newRotate = startRotate + proportion * (90 - startRotate)
      newRotateSecond = startRotateSecond + proportion * (35 - startRotateSecond)

      newOpacity = startOpacity + ((newVerticalPosition - startVerticalPosition - 20) / (heightViewport * 0.2)) * (1 - startOpacity)

      // Позиции остановки движения + поворот с прозрачностью для 0 карты
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
          if (newVerticalPosition > 2 * win.width / 1.6 - 160) newVerticalPosition = 2 * win.width / 1.6 - 160
          break
        case 3:
          if (newVerticalPosition > 3 * win.width / 1.6 - 285) newVerticalPosition = 3 * win.width / 1.6 - 285
          break
        case 4:
          if (newVerticalPosition > 4 * win.width / 1.6 - 445) newVerticalPosition = 4 * win.width / 1.6 - 445
          break
        default:
          if (newVerticalPosition > position * win.width / 1.6) newVerticalPosition = position * win.width / 1.6
      }

      // Поправки на кол-во карт
      if (total === 3) {
        switch (position) {
          case 1:
            if (newVerticalPosition > win.width / 1.6 - 60) newVerticalPosition = win.width / 1.6 - 60
            break
          case 2:
            if (newVerticalPosition > 2 * win.width / 1.6 - 160) newVerticalPosition = 2 * win.width / 1.6 - 160
            break
        }
      }

      // Остановки для размера и прозрачности
      if (newScaleX >= 1) newScaleX = 1
      if (total === 3) newScaleX = 1
      if (newOpacity >= 1) newOpacity = 1
    }

    // Выставляем значения
    this.setState({
      previousStep: step,
      verticalPosition: newVerticalPosition,
      rotate: newRotate,
      opacity: newOpacity,
      scaleX: newScaleX,
      rotateSecond: newRotateSecond,
      initionVerticalPosition: ((initionVerticalPosition === null) && (step === 0)) ? newVerticalPosition : initionVerticalPosition //Рассчитаная позиция на step == 0 для всех карт
    })
  }

  render () {
    const stepVerticalPosition = this.state.verticalPosition
    const stepRotate = this.state.rotate
    const stepOpacity = this.state.opacity
    const stepRotateSecond = this.state.rotateSecond
    const stepScaleX = this.state.scaleX

    // Движение карты
    const stepBlock = {
      transform: [{ rotateX: stepRotate + 'deg'}, {perspective: 1000}, {rotateX: -stepRotateSecond + 'deg'}, {scaleX: stepScaleX}],
      top: stepVerticalPosition,
      opacity: stepOpacity
    }

    // Прозрачность 3d
    let stepSecondOpacity = 0
    if (stepVerticalPosition > 0.2 * this.heightViewport) stepSecondOpacity = stepVerticalPosition / this.heightViewport
    // Движение псевдо 3d (нет аналога css preserve3d в react-native)
    const stepAddView = {
      transform: [{rotateX: 130 - stepRotate + 'deg'}],
      opacity: stepSecondOpacity
    }

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
