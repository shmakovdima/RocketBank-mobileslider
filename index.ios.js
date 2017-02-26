'use strict';
import {
   AppRegistry,
   StatusBar,
 } from 'react-native';

 import App from './src/containers/app.js';

 StatusBar.setBarStyle('light-content', true);

 AppRegistry.registerComponent('App', () => App);
