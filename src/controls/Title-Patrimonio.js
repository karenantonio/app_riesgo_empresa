import React, { Component } from 'react';
import { Label, Text } from 'native-base'
import { View } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'

class TitleV extends Component {
    state = {
        titulo: '',
        combinacion: []
    }

    UNSAFE_componentWillMount() {

        const configs = this.props.configs;

        this.setState({
            titulo: configs.filter(row => row.Nombre === "titulo")[0].Valor,
            combinacion: JSON.parse(configs.filter(row => row.Nombre === "combinacion")[0]?.Valor),
        });
    }

    render() {

        let titulo = '';
        const configs = this.props.configs;

        const pauta = this.props.state.filter(item => item.id === "1.1Listaseleccionado")[0].valor
        const faena = this.props.state.filter(item => item.id === "1.2Listaseleccionado")[0].valor
        const cargo = this.props.state.filter(item => item.id === "1.3Listaseleccionado")[0].valor
        let curren_combinacion = `${pauta},${faena},${cargo}`

        let visible = (pauta == '' || faena == '' || cargo == '') ? false : true

        if (visible) {
            if (this.state.combinacion.filter(com => com === curren_combinacion).length > 0) {
                titulo = this.state.titulo;
            }
        };

        return (
            !visible ?
                (<View />)
                :
                titulo !== '' &&
                <View>
                    <View style={{ marginTop: '4%', alignItems: 'center', backgroundColor: '#EFF1F0', height: 50, justifyContent: 'center'}}>
                        <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: this.props.theme.primary, fontWeight: 'bold' }}>
                            {titulo}
                        </Text>
                    </View>
                </View>


        );
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.reducerValores,
    }
};

export default connect(mapStateToProps, null)(TitleV);