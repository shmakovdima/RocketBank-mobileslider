import React, {Component} from 'react'
import { Actions } from 'react-native-router-flux'

import Style from './../styles/style'

import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native'

export default class CardInfo extends Component {
  render () {
    return (
      <View style={Style.rootCart__info}>
        <Image style={Style.rootCart__image} resizeMode={'contain'} source={require('../../images/card.png')}/>
        <View style={Style.rootCart}>
          <View style={Style.rootCart__row}>
            <Image style={Style.rootCart__row__image} source={require('../../images/1.png')}/>
            <Text style={Style.rootCart__row__text}>Пополнить карту</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/2.png')}/>
            <Text style={Style.rootCart__row__text}>Между картами и счетами</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/3.png')}/>
            <Text style={Style.rootCart__row__text}>Реквизиты моего счета</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/4.png')}/>
            <Text style={Style.rootCart__row__text}>Уведомления</Text>
            <Text style={Style.rootCart__row__subtext}>Push</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/5.png')}/>
            <Text style={Style.rootCart__row__text}>Тариф</Text>
            <Text style={Style.rootCart__row__subtext}>Уютный космос Зарплатный</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/6.png')}/>
            <Text style={Style.rootCart__row__text}>Сменить пин</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/7.png')}/>
            <Text style={Style.rootCart__row__text}>Ограничения</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/8.png')}/>
            <Text style={Style.rootCart__row__text}>Справки</Text>
          </View>
          <View style={[Style.rootCart__row, Style.rootCart__row__border]}>
            <Image style={Style.rootCart__row__image} source={require('../../images/9.png')}/>
            <Text style={Style.rootCart__row__text}>Перевыпустить карту</Text>
          </View>
        </View>
        <TouchableHighlight onPress={() => Actions.cardbar()} style={Style.rootCart__button} underlayColor='white'>
          <Image style={Style.rootCart__button__image} source={require('../../images/button.png')}/>
        </TouchableHighlight>
      </View >
    )
  }
}
