import React, { Component } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Body, Header, Input, Label, Picker, Text, View, ListItem, List } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import { actionSetValorControl } from '../store/actions';
import { log } from 'handlebars/runtime';

class GrupoOPS extends Component {
    state = {
        titulo: '',
        data: [],
        dataFiltrada: [],
        dataBusqueda: [],
        filtro: '',
        rutas: [],
        proceso: [],
        ops: [],
        datos: [],
        modalConductasVisible: false,
        modalNuevoVisible: true,
        tmpNuevaConducta: undefined,
        data_pro: [],
        val_pro: "",
        val_ruta: "",
        val_conducta: "",
        modal_con: false
    }

    onSelectSave(value) {
        let { tmpNuevaConducta, ops, datos, data_pro, rutas, dataBusqueda } = this.state;

        let ruta = rutas.filter(ruta => ruta.Valor === value)[0];
        let proceso = data_pro.filter(pro => pro.Texto1 === value)[0];
        let conducta = '';

        if (proceso) {
            proceso = { idProceso: proceso.Texto2, nombreProceso: proceso.Texto1 }
            let exist_pro = data_pro.filter(pro => pro.Texto2 === ops.map(x=> x.idProceso)[0])
            if(exist_pro.length > 0){
                let newArr = ops.map((item) => {
                    if (item.idProceso){
                        return {
                            ...item,
                            idProceso: proceso.idProceso,
                            nombreProceso: proceso.nombreProceso
                        };
                    } else {return item}
                });
                ops = newArr;
           } else {ops.push(proceso)}
        }
        if (ruta) { 
            ruta = { idRuta: ruta.Valor, nombreRuta: ruta.Nombre } 
            let exist_ruta = rutas.filter(ruta => ruta.Nombre === ops.map(x=> x.nombreRuta)[0])
            if(exist_ruta.length > 0){
                let newArr = ops.map((item) => {
                    if (item.idRuta){
                        return {
                            ...item,
                            idRuta: ruta.idRuta,
                            nombreRuta: ruta.nombreRuta
                        };
                    } else {return item}
                });
                ops = newArr;
            } else {ops.push(ruta)}
        }
        if (!proceso && !ruta) { 
            conducta = { idConducta: value.Texto2, nombreConducta: value.Texto1 } 
            let exist_conducta = dataBusqueda.filter(con => con.Texto2 === ops.map(x=> x.idConducta)[0])
            if(exist_conducta.length > 0){
                let newArr = ops.map((item) => {
                    if (item.idConducta){
                        return {
                            ...item,
                            idConducta: conducta.idConducta, 
                            nombreConducta: conducta.nombreConducta
                        };
                    } else {return item}
                });
                ops = newArr;
            } else {ops.push(conducta)}
        }

        this.setState({
            tmpNuevaConducta: {
                ...tmpNuevaConducta,
                ...ruta,
                ...proceso,
                ...conducta
            }
        });

        if (this.state.ops.length % 3 == 0) {
            this.setState({ tmpNuevaConducta: undefined });
            let GrupoOps = {
                idProceso: ops.find(x => x.idProceso !== undefined).idProceso,
                nombreProceso: ops.find(x => x.nombreProceso !== undefined).nombreProceso,
                idConducta: ops.find(x => x.idConducta !== undefined).idConducta,
                nombreConducta: ops.find(x => x.nombreConducta !== undefined).nombreConducta,
                idRuta: ops.find(x => x.idRuta !== undefined).idRuta,
                nombreRuta: ops.find(x => x.nombreRuta !== undefined).nombreRuta
            };

            datos.push({
                ...GrupoOps
            })

            ops.splice(0);
            this.props.setValorControl(this.props.id, this.props.tipo, "seleccionados", datos);
        }
    }

    onDeleteConducta(conducta) {
        let ops = this.state.datos.filter(item => item.idConducta !== conducta.idConducta);

        this.setState({ datos: ops });
        this.props.setValorControl(this.props.id, this.props.tipo, "seleccionados", ops);
    }

    componentDidMount() {
        const configs = this.props.configs;

        let data_pro = [];

        let nombre_lista_pro = configs.filter(row => row.Nombre === 'lista_exp')[0].Valor;
        let lista_pro = this.props.listas.filter(row => row.Codigo === nombre_lista_pro);

        let titulo = configs.filter(row => row.Nombre === 'titulo')[0].Valor;

        let nombre_lista = configs.filter(row => row.Nombre === 'lista')[0].Valor;
        let lista = this.props.listas.filter(row => row.Codigo === nombre_lista);
        let data = [];

        if (lista_pro.length > 0) {
            data_pro = lista_pro[0].Items;
        }
        if (lista.length > 0) {
            data = lista[0].Items;
        } else {
            Alert.alert(
                'Cuidado',
                `La lista '${nombre_lista}' no esta disponible. Revise la configuración del formulario.`
            );
        }

        let rutas = JSON.parse(configs.filter(row => row.Nombre === 'rutas')[0].Valor);

        this.setState({
            titulo: titulo,
            data: data,
            dataFiltrada: data,
            dataBusqueda: data,
            rutas: rutas,
            data_pro: data_pro
        });
    }

    render() {
        let { data_pro, titulo, val_pro, tmpNuevaConducta } = this.state;
        return (
            <View>
                {/* Picker de Proceso */}
                <Grid style={{ marginTop: 15, marginLeft: '5%', marginRight: '5%' }}>
                    <Label style={{ fontSize: 15, color: this.props.baseColor.Valor, fontWeight: 'bold' }}>PROCESO</Label>
                    <Row>
                        <Col style={{ width: '100%', borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2, fontSize: 14, minHeight: 50 }}>
                            <Picker style={{ color: this.props.baseColor.Valor, width: '100%' }}
                                note
                                mode="dropdown"
                                selectedValue={tmpNuevaConducta?.nombreProceso}
                                onValueChange={(pro) => { this.onSelectSave(pro) }}>
                                <Picker.Item label={'Seleccione'} value={undefined} />
                                {data_pro.map((item, i) =>
                                    <Picker.Item key={i} label={item.Texto1} value={item.Texto1} />
                                )}
                            </Picker>
                        </Col>
                    </Row>
                </Grid>
                {/* Picker de Conductas */}
                <Grid style={{ marginTop: 15, marginLeft: '5%', marginRight: '5%' }}>
                    <Label style={{ fontSize: 15, color: this.props.baseColor.Valor, fontWeight: 'bold' }}>{titulo.toUpperCase()}</Label>
                    <Row>
                        <Col style={{ width: '100%', borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2, fontSize: 14, minHeight: 50 }}>
                            <TouchableOpacity
                                style={{
                                    borderBottomColor: this.props.baseColor.Valor,
                                    fontSize: 14,
                                    minHeight: 50,
                                }}
                                onPress={() => { this.setState({ modal_con: true }) }}>
                                {tmpNuevaConducta?.nombreConducta ?
                                    <Text style={{ color: this.props.baseColor.Valor, fontSize: 16, marginLeft: '2%', marginTop: 15, marginBottom: 15 }}>
                                        {tmpNuevaConducta?.nombreConducta}
                                    </Text>
                                    :
                                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, justifyContent: "space-between" }}>
                                        <Text style={{ color: this.props.baseColor.Valor, fontSize: 16, paddingLeft: '2%' }}>
                                            {'Seleccione'}
                                        </Text>
                                        <View style={{ paddingRight: '5%' }}>
                                            <Icon type="font-awesome" name="caret-down" size={14} />
                                        </View>
                                    </View>
                                }
                            </TouchableOpacity>

                            <Modal
                                onRequestClose={() => { this.setState({ modal_con: false }) }}
                                hardwareAccelerated={true}
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modal_con}>
                                <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 90}}>
                                    <List
                                        style={{
                                            borderBottomColor: this.props.baseColor.Valor,
                                            borderBottomWidth: 2,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            marginBottom: '5%',
                                            backgroundColor: 'white'
                                        }}>
                                        <View>
                                            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10, marginTop: 5, color: this.props.baseColor.Valor }}>
                                                CONDUCTAS LGF
                                            </Text>
                                        </View>
                                        <FlatList
                                            data={this.state.dataBusqueda}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            renderItem={({ item }) => (
                                                <ListItem
                                                    noIndent
                                                    style={{
                                                        paddingTop: 5,
                                                        paddingBottom: 5,
                                                        paddingLeft: 5,
                                                        paddingRight: 5,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: 'gray',
                                                        borderTopColor: 'gray'
                                                    }}
                                                    onPress={() => {
                                                        this.setState({ modal_con: false });
                                                        this.onSelectSave(item);
                                                    }}>
                                                    <View>
                                                        <Text style={{ alignSelf: 'stretch' }}>
                                                            {item.Texto1}
                                                        </Text>
                                                    </View>
                                                </ListItem>
                                            )}
                                        />
                                    </List>
                                </View>
                            </Modal>
                        </Col>
                    </Row>
                </Grid>
                {/* Picker de Rutas de Faena */}
                <Grid style={{ marginTop: 15, marginLeft: '5%', marginRight: '5%' }}>
                    <Label style={{ fontSize: 15, color: this.props.baseColor.Valor, fontWeight: 'bold' }}>RUTA FAENA</Label>
                    <Row>
                        <Col style={{ width: '100%', borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2, fontSize: 14, minHeight: 50 }}>
                            <Picker
                                note
                                mode='dropdown'
                                selectedValue={tmpNuevaConducta?.idRuta}
                                style={{ color: this.props.baseColor.Valor }}
                                onValueChange={value => { this.onSelectSave(value) }}>
                                <Picker.Item key={'ruta0'} label={'Seleccione'} value={undefined} />
                                {this.state.rutas.map(ruta => {
                                    return (
                                        <Picker.Item key={`ruta${ruta.Valor}`} label={ruta.Nombre} value={ruta.Valor} size={20} />
                                    );
                                })}
                            </Picker>
                        </Col>
                    </Row>
                </Grid>

                {this.state.datos.map(ops => {
                    return (
                        <View
                            key={`ops${ops.idConducta}`}
                            style={styles.ops}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.opsItems}>
                                    <Text style={{ color: this.props.baseColor.Valor, fontSize: 14 }}>PROCESO</Text>
                                    <Text style={{ fontSize: 14 }}>{ops.nombreProceso}</Text>
                                </View>
                                <View style={styles.opsItems}>
                                    <Text style={{ color: this.props.baseColor.Valor, fontSize: 14 }}>CONDUCTA</Text>
                                    <Text style={{ fontSize: 14 }}>{ops.nombreConducta}</Text>
                                </View>
                                <View style={styles.opsItems}>
                                    <Text style={{ color: this.props.baseColor.Valor, fontSize: 14 }}>RUTA FAENA</Text>
                                    <Text style={{ fontSize: 14 }}>{ops.nombreRuta}</Text>
                                </View>
                            </View>
                            <Icon style={styles.opsDeleteIcon} type='font-awesome' name='close'
                                onPress={() => { this.onDeleteConducta(ops); }} />
                        </View>
                    );
                })}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        docValores: state.reducerValores
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GrupoOPS);

const styles = StyleSheet.create({
    title: {
        marginLeft: 5,
        marginTop: 15,
        marginBottom: 11,
        fontSize: 14
    },
    selector: {
        borderBottomWidth: 2,
        fontSize: 14,
        minHeight: 30,
        paddingLeft: 5,
        paddingRight: 5
    },
    ops: {
        backgroundColor: '#0000000B',
        borderRadius: 4,
        paddingBottom: 12,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row'
    },
    opsItems: {
        width: '100%',
        padding: 12,
        paddingBottom: 0
    },
    opsDeleteIcon: {
        paddingTop: 12,
        paddingRight: 12,
        color: 'grey',
        fontSize: 18
    },
    modalConductasContainer: {
        flex: 1,
        flexDirection: 'column-reverse'
    },
    modalConductasSearchContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        borderColor: 'transparent',
        borderWidth: 2,
        alignItems: 'center'
    },
    modalConductasSearchInput: {
        flex: 1,
        borderBottomWidth: 2,
        padding: 2
    },
    modalConductasItem: {
        padding: 7
    },
    modalNuevoContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    modalNuevoHeader: {
        color: 'white',
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'center'
    },
    modalNuevoItems: {
        width: '100%',
        padding: 20,
        paddingBottom: 0
    },
    modalNuevoRuta: {
        borderColor: 'transparent',
        borderBottomColor: 'grey',
        borderWidth: 2
    }
});

