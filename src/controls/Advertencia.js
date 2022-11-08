import React, { Component } from 'react';
import { Label, Text } from 'native-base'
import { View } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'

class Advertencia extends Component {

    render() {

        const pauta = this.props.state.filter(item => item.id === "1.1Listaseleccionado")[0].valor
        const faena = this.props.state.filter(item => item.id === "1.2Listaseleccionado")[0].valor
        const cargo = this.props.state.filter(item => item.id === "1.3Listaseleccionado")[0].valor

        let visible = (pauta == '' || faena == '' || cargo == '') ? false : true

        return (
            visible ?
                (<View />)
                :
                (
                    <View>
                        <Grid
                            style={{
                                borderColor: "transparent",
                                borderWidth: 1,
                                borderRadius: 10,
                                margin: 5,
                                padding: 10,
                                marginTop: '20%',
                                alignItems: 'center'
                            }}
                        >
                            <Row style={{ justifyContent: 'center', marginTop: 10 }}>
                                <Icon
                                    name='warning'
                                    type='font-awesome'
                                    color='gray' size={80}
                                    resizeMode="contain"
                                    onPress={() => {
                                        console.log('asd')
                                    }}
                                />
                            </Row>
                            <Label style={{ fontFamily: 'Roboto', fontSize: 16, color: 'black', marginTop: 10 }}>
                                {'!Atención!'}
                            </Label>
                        </Grid>
                        <View style={{ marginTop: '2%', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: this.props.theme.primary, fontWeight: 'bold' }}>
                                {'Debe seleccionar filtros para visualizar preguntas'}
                            </Text>
                        </View>
                    </View>
                )
        );
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.reducerValores,
    }
};

export default connect(mapStateToProps, null)(Advertencia);