import React, { Component } from 'react';
import { Label, Text } from 'native-base'
import { View } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'

class SubTitleV extends Component {
    state = {
        subtitulo: '',
        combinacion: []
    }

    UNSAFE_componentWillMount() {

        const configs = this.props.configs;

        this.setState({
            subtitulo: configs.filter(row => row.Nombre === "subtitulo")[0].Valor,
            combinacion: JSON.parse(configs.filter(row => row.Nombre === "combinacion")[0]?.Valor)
        });
    }

    render() {

        let subtitulo = '';
        const configs = this.props.configs;

        const pauta = this.props.state.filter(item => item.id === "1.1Listaseleccionado")[0].valor
        const faena = this.props.state.filter(item => item.id === "1.2Listaseleccionado")[0].valor
        const cargo = this.props.state.filter(item => item.id === "1.3Listaseleccionado")[0].valor
        let curren_combinacion = `${pauta},${faena},${cargo}`

        let visible = (pauta == '' || faena == '' || cargo == '') ? false : true

        if (visible) {
            if (this.state.combinacion.filter(com => com === curren_combinacion).length > 0) {
                subtitulo = this.state.subtitulo;
            };
        };

        return (
            !visible ?
                (<View />)
                :
                subtitulo !== '' &&
                    <View>
                        <View style={{ marginTop: '2%', paddingLeft: 10 }}>
                            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: this.props.theme.primary, fontWeight: 'bold' }}>
                                {subtitulo}
                            </Text>
                        </View>
                    </View>
                    // :
                    // <View>
                    //     <View style={{ marginTop: '2%', paddingLeft: 10 }}>
                    //         <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: this.props.theme.primary, fontWeight: 'bold' }}>
                    //             {'Area de gestion no aplica para esta pauta'}
                    //         </Text>
                    //     </View>
                    // </View>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.reducerValores,
    }
};

export default connect(mapStateToProps, null)(SubTitleV);