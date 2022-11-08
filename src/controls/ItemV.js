import React, { Component } from 'react';
import { Label, Text } from 'native-base'
import { View } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icon } from 'react-native-elements'

class ItemV extends Component {

    render() {

        // const configs = this.props.configs;
        // const order = this.props.orden;
        // let titulo = configs.filter(row => row.Nombre === "titulo")[0].Valor;

        return (
            <View key={this.props.orden} style={{ paddingTop: 10 }}>
                {this.props.renderizar(this.props)}
            </View>
        );
    };
};

export default ItemV; 
