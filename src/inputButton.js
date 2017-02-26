// InputButton.js

import React, { Component } from 'react';
import {
    TouchableHighlight,
    Text
} from 'react-native';

import Style from './styles/style';

export default class InputButton extends Component {

    render() {
        return (
            <TouchableHighlight style={[Style.inputButton, this.props.highlight ? Style.inputButtonHighlighted : null]}>
                <Text style={Style.inputButtonText} underlayColor="#193441" onPress={this.props.onPress}>{this.props.value}</Text>
            </TouchableHighlight>
        )
    }

}
