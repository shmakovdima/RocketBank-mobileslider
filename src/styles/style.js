import PlatformStyleSheet from './PlatformStyleSheet.js'

import {Dimensions} from 'react-native'
const win = Dimensions.get('window')

var Style = PlatformStyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 25
  },
  statuwBar: {
    paddingTop: 20,
    paddingBottom: 20
  },
  statuwBar__row: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  statusBar__text: {
    color: '#abb1b5',
    fontSize: 14
  },
  statusBar__text__left: {
    flex: 1
  },
  statusBar__text__right: {
    flex: 1,
    textAlign: 'right'
  },
  statuwBar__row__inside: {
    paddingTop: 10,
    paddingBottom: 10
  },
  statusBar__row__image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden'
  },
  statusBar__row__textright: {
    textAlign: 'right',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statusBar__row__textcenter: {
    fontSize: 15,
    color: '#383838'
  },
  statusBar__row__centerblock: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  statusBar__row__comment: {
    paddingTop: 4
  },
  statusBar__row__blockright: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  rootCart: {
    backgroundColor: '#ffffff',
    padding: 25,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  rootCart__info: {
    flex: 1,
    backgroundColor: 'rgba(176, 176, 176, 0.8)'
  },
  rootCart__image: {
    position: 'absolute',
    right: 0,
    top: -65,
    width: win.width
  },
  rootCart__button: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.2
  },
  rootCart__button__image: {
    width: 30,
    height: 30
  },
  rootCart__row__image: {
    width: 28,
    height: 28
  },
  rootCart__row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10
  },
  rootCart__row__border: {
    paddingTop: 10,
    borderStyle: 'solid',
    borderColor: '#f3f3f3',
    borderTopWidth: 1
  },
  rootCart__row__text: {
    color: '#333333',
    fontSize: 14,
    paddingLeft: 12,
    paddingRight: 12
  },
  rootCart__row__subtext: {
    color: '#999999',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  cardBar: {
    width: win.width,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'center'
  },
  cardBar__item: {
    position: 'absolute',
    left: 20,
    height: win.height/1.65,
    paddingTop: 20,
    width: win.width
  },
  cardBar__item__image: {
    width: win.width - 80,
    left: 20,
    top: -(win.height / 2) + 10.5 + (win.width - 60) / 1.65,
    resizeMode: 'contain'
  },
  cardBar__item__imageAddings: {
    width: win.width - 70 - 24,
    height: 4,
    opacity: 0,
    zIndex: 1,
    top: 8,
    left: 25,
    position: 'absolute',
    backgroundColor: '#444'
  }
})

export default Style
