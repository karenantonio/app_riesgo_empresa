import React, { Component, PureComponent } from 'react';
import { Input as Input2, Item, Label, Text, Button, Textarea, Content, Body, Badge, Picker, ListItem } from 'native-base'
import { View, Image, Alert, Modal, ScrollView, TouchableOpacity, ImageBackground, PermissionsAndroid } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import MultiSelect from 'react-native-multiple-select';
import { connect } from 'react-redux';
import { actionSetValorControl, actionSetCheckActivo, actionSetCheckDefaultValues, actionUpdateDoc } from '../store/actions'
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { Icon, Button as Button2 } from 'react-native-elements'
import { getUID } from '../functions/common'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const optionsPhotos = {
    title: 'Seleccione imagen',
    quality: 0.8,
    maxWidth: 420,
    maxHeight: 560,
    includeBase64: true
};

const items = [
    {
        id: 1,
        name: 'Informar'
    }, {
        id: 2,
        name: 'Reparar'
    }, {
        id: 3,
        name: 'Capacitar'
    }, {
        id: 4,
        name: 'Implementar'
    }, {
        id: 5,
        name: 'Remplazar'
    }
];

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            Alert.alert('¡Atención!', 'No podrá tomar fotos si no otorga permisos.');
        }
    } catch (err) {
        console.warn(err);
    }
};

class CheckMMH extends React.Component {

    state = {
        name: '',
        opciones: [],
        toolbar: false,
        pregunta: "",
        f_pregunta: '',
        ponderacion: "",
        pagina: "",

        /* Filtros  */
        combinacion: [],

        id: "",
        fecha: "",
        comentario: "",
        gravedad: "",
        accionc: [],
        adjunto: "",
        presionado: { codigo: "", time: 0 },
        modal: false,
        observaciones: [],
        fotos: [],
        img: "",
        multimagen: false,

        ifCumple: false,
        ifNocumple: false,
        ifNoaplica: false,
        msj: "Primero debe calificar y seleccionar una pregunta para hacer una Observación."
    }

    onSelectedItemsChange = accionc => {
        this.setState({ accionc });
    };

    //Multi imagen
    takeMultiPhoto = () => {
        launchCamera(optionsPhotos, (response) => {
            if (response.didCancel) { }
            else if (response.error) { Alert.alert('ImagePicker Error: ', response.error); }
            else if (response.customButton) { }
            else {
                const file = { file: "data:" + response.type + ";base64," + response.base64 };
                let { fotos } = this.state;
                fotos.push({ id: getUID(), imagen: file });
                this.setState({ adjunto: file }); // Variable auxiliar para cargar el view de las fotos 
            }
        });
    }

    searchMultiPhoto = () => {
        launchImageLibrary(optionsPhotos, (response) => {
            if (response.didCancel) { }
            else if (response.error) { Alert.alert('ImagePicker Error: ', response.error); }
            else if (response.customButton) { }
            else {
                const file = { file: "data:" + response.type + ";base64," + response.base64 };
                this.state.fotos.push({ id: getUID(), imagen: file });
                this.setState({ adjunto: file });
            }
        });
    }

    deletePhoto = (foto) => {
        let { fotos } = this.state;
        this.setState({ fotos: fotos.filter(larow => larow.id !== foto.id) });
    }

    UNSAFE_componentWillMount() {

        const configs = this.props.configs;

        let opciones = JSON.parse(configs.filter(row => row.Nombre === "opciones")[0].Valor);

        const presionado = JSON.parse(this.props.valores.filter(row => row.Nombre === "presionado")[0].Valor)

        let observaciones = [];

        if (this.props.valores.filter(row => row.Nombre === "observaciones")[0].Valor != '""') {
            observaciones = JSON.parse(this.props.valores.filter(row => row.Nombre === "observaciones")[0].Valor)
        }

        this.setState({
            pregunta: configs.filter(row => row.Nombre === "pregunta")[0].Valor,
            combinacion: JSON.parse(configs.filter(row => row.Nombre === "combinacion")[0]?.Valor),
            ponderacion: configs.filter(row => row.Nombre === "ponderacion")[0].Valor,
            opciones,
            presionado: { codigo: presionado, time: (new Date()).getTime() },
            observaciones
        });
    }

    _renderOptions = (active, opciones) => {
        let presionado = this.state.presionado.codigo;

        if (this.props.check_default_values !== []) {
            for (var ii = 0; ii < this.props.check_default_values.length; ii++) {
                if (this.props.check_default_values[ii].id === this.props.id && this.props.check_default_values[ii].time > this.state.presionado.time) {
                    presionado = this.props.check_default_values[ii].value;
                }

            }
        }

        return opciones.map((item, i) => {

            let color = "grey";
            let iconName = (item.iconName === undefined || item.iconName === null) ? "check-circle" : item.iconName;
            let iconLibrary = (item.iconLibrary === undefined || item.iconLibrary === null) ? "font-awesome" : item.iconLibrary;
            let iconColor = (item.iconColor === undefined || item.iconColor === null) ? this.props.theme.commonOkColor : item.iconColor;

            if (item.codigo === presionado) {
                color = iconColor;
            }

            return (
                <Col key={i} onPress={() => {
                    if (active === false) {
                        return;
                    }
                    let { opciones } = this.state;
                    for (var i = 0; i < opciones.length; i++) {
                        if (opciones[i].codigo === item.codigo) {
                            if (opciones[i].codigo === "si") {
                                this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                                this.setState({ ifCumple: true, ifNoaplica: false, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, msj: "Primero debe calificar y seleccionar una pregunta para hacer una Observación." });
                            } else if (opciones[i].codigo === "no") {
                                this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                                this.setState({ ifCumple: false, ifNoaplica: false, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, msj: "Primero debe calificar y seleccionar una pregunta para hacer una Observación." });
                            } else {
                                if (this.state.observaciones.length !== 0) {
                                    Alert.alert('¡Atención!', 'Al macar como No Aplica se eliminarán las observaciones de esta pregunta.',
                                        [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                                            text: 'OK', onPress: () => {
                                                this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                                                this.props.setValorControl(this.props.id, this.props.tipo, "observaciones", "");
                                                this.setState({ ifCumple: false, ifNoaplica: true, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, observaciones: [], msj: "No puede ingresar una observación en un No Aplica." });
                                            }
                                        },], { cancelable: false },
                                    );
                                } else {
                                    this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                                    this.setState({ ifCumple: false, ifNoaplica: true, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, msj: "No puede ingresar una observación en un No Aplica." });
                                }
                            }

                            //NUEVA FUN. MARK ANOTHER OPTION AND ANOTHER HIDE
                            let nuevo = [];

                            if (opciones.filter(row => row.codigo === item.codigo)[0]["markAnotherOption"]) {
                                const markAnotherOption = opciones.filter(row => row.codigo === item.codigo)[0]["markAnotherOption"];
                                for (var a = 0; a < markAnotherOption.length; a++) {
                                    this.props.setValorControl(markAnotherOption[a][0], this.props.tipo, "presionado", markAnotherOption[a][1]);
                                    nuevo.push({ id: markAnotherOption[a][0], action: "mark", value: markAnotherOption[a][1], time: (new Date()).getTime() });
                                }
                            }

                            if (opciones.filter(row => row.codigo === item.codigo)[0]["hideAnotherOption"]) {
                                const hideAnotherOption = opciones.filter(row => row.codigo === item.codigo)[0]["hideAnotherOption"];
                                for (var a = 0; a < hideAnotherOption.length; a++) {
                                    nuevo.push({ id: hideAnotherOption[a], action: "hide", value: "", time: 0 }); //PARA ESTE CASO NO APLICA EL VALUE Y EL TIME
                                }
                            }

                            if (opciones.filter(row => row.codigo === item.codigo)[0]["showAnotherOption"]) {
                                const showAnotherOption = opciones.filter(row => row.codigo === item.codigo)[0]["showAnotherOption"];
                                for (var a = 0; a < showAnotherOption.length; a++) {
                                    nuevo.push({ id: showAnotherOption[a], action: "show", value: "", time: 0 }); //PARA ESTE CASO NO APLICA EL VALUE Y EL TIME
                                }
                            }

                            if (nuevo.length > 0) {
                                this.props.setCheckDefaultValues(nuevo);
                            }

                            this.props.setCheckActivo(this.props.id);
                            this.setState({ toolbar: true });
                        }
                    }
                }}>
                    <Icon name={iconName} type={iconLibrary} color={color} size={35} resizeMode="contain" />
                </Col>
            )
        })
    }

    render() {
        // Filtro de preguntas segun lo ingresado listas 
        let titulo = '';
        let f_pregunta = '';
        let opciones = [];

        const pauta = this.props.state.filter(item => item.id === "1.1Listaseleccionado")[0].valor
        const faena = this.props.state.filter(item => item.id === "1.2Listaseleccionado")[0].valor
        const cargo = this.props.state.filter(item => item.id === "1.3Listaseleccionado")[0].valor
        let curren_combinacion = `${pauta},${faena},${cargo}`

        let visible = (pauta == '' || faena == '' || cargo == '') ? false : true

        if (visible) {
            if (this.state.combinacion.filter(com => com === curren_combinacion).length > 0) {
                f_pregunta = this.state.pregunta;
                opciones = this.state.opciones;
            }
        };

        /* ******************************************* */

        const { accionc } = this.state;

        requestCameraPermission();
        let active = true;
        if (this.props.check_default_values !== []) {
            for (var ii = 0; ii < this.props.check_default_values.length; ii++) {
                if (this.props.check_default_values[ii].action === "hide" && this.props.check_default_values[ii].id === this.props.id) {
                    active = false;
                }
            }
        }

        return (
            !visible ?
                (<View />)
                :
                f_pregunta !== '' &&
                <View>

                    <Grid style={{ borderRadius: 10, margin: 2, padding: 5, backgroundColor: "#FFFFFF" }} onPress={() => {
                        if (this.state.presionado.codigo !== "" && active === true) {
                            this.props.setCheckActivo(this.props.id);
                            this.setState({ toolbar: true });
                        }
                    }}>

                        {/* Muestra las preguntas */}
                        {f_pregunta !== '' &&
                            <Row>
                                <Col style={{ flex: 6, borderColor: "grey", borderWidth: 1, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 16, height: '100%', margin: 10, color: this.props.theme.primary }}>{f_pregunta}</Text>
                                </Col>
                            </Row>
                        }

                        {/* Muestra botones aplica, no aplica, n/a y observaciones */}
                        {f_pregunta !== '' &&
                            <Row style={{ flex: 1, marginTop: '2%' }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '75%', flexDirection: 'row' }}>
                                        {this._renderOptions(active, opciones)}
                                    </View>
                                    <View style={{ width: '25%' }}>
                                        {(this.state.toolbar === true && this.props.check_activo === this.props.id && active === true && this.state.ifNoaplica == false) ?
                                            (
                                                <Icon
                                                    name='plus'
                                                    tyle={{ marginLeft: 100 }}
                                                    type='font-awesome'
                                                    color='gray'
                                                    size={35}
                                                    resizeMode="contain"
                                                    onPress={() => {
                                                        if (this.state.ifCumple == false) {
                                                            const manana = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000 * 29);
                                                            const manana_format = ('0' + manana.getDate()).slice(-2) + '-' + ('0' + (manana.getMonth() + 1)).slice(-2) + '-' + manana.getFullYear();
                                                            this.setState({ modal: true, fecha: manana_format, comentario: "", adjunto: "", id: "", fotos: [], gravedad: '', accionc: '' });
                                                        } else {
                                                            this.setState({ modal: true, fecha: "", comentario: "", adjunto: "", id: "", fotos: [] });
                                                        }
                                                    }}
                                                />
                                            )
                                            :
                                            (
                                                <Icon
                                                    name='plus'
                                                    type='font-awesome'
                                                    color='gray'
                                                    size={35}
                                                    resizeMode="contain"
                                                    onPress={() => {
                                                        Alert.alert('¡Atención!', this.state.msj);
                                                    }}
                                                />
                                            )
                                        }
                                    </View>
                                </View>
                            </Row>
                        }

                        {/* Muestra Label con cantidad de observaciones bajo cada pregunta */}
                        {(this.state.toolbar === true) &&
                            <Row>
                                <Grid style={{ marginTop: 10 }}>
                                    {this.state.observaciones.length > 0 && <Text style={{ marginTop: 2, fontSize: 12, marginLeft: 1, color: this.props.theme.primary }}>{this.state.observaciones.length === 1 ? "1 Observación" : this.state.observaciones.length + " Observaciones"}</Text>}
                                </Grid>
                            </Row>
                        }

                        {/* Muestra el detalle de las observaciones de la pregunta activa */}
                        {(this.state.toolbar === true && this.props.check_activo === this.props.id && active === true) &&
                            <Row>
                                <Grid style={{ marginTop: 10 }}>
                                    {this.state.observaciones.map((row, key) => {
                                        return (<Row key={key} style={{ marginTop: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 20, padding: 5 }}>
                                            <Col size={2}>
                                                <Text>{row.comentario}</Text>
                                            </Col>
                                            <Grid style={{ alignItems: 'center' }}>
                                                <Col>
                                                    {
                                                        <Button
                                                            small
                                                            primary
                                                            style={{ backgroundColor: this.props.theme.tertiary, marginLeft: 3, borderRadius: 20 }}
                                                            onPress={() => {
                                                                //EDITAR:
                                                                this.setState({
                                                                    modal: true,
                                                                    id: row.id,
                                                                    comentario: row.comentario,
                                                                    adjunto: row.adjunto,
                                                                    fotos: row.fotos,
                                                                    gravedad: row.gravedad,
                                                                    accionc: row.accionc,
                                                                    fecha: row.fecha,
                                                                });
                                                            }}
                                                        >
                                                            <Body>
                                                                <Icon
                                                                    name='edit'
                                                                    color={"white"}
                                                                    type="font-awesome"

                                                                />
                                                            </Body>
                                                        </Button>
                                                    }
                                                </Col>
                                                <Col>
                                                    <Button onPress={() => {
                                                        //ELIMINAR:
                                                        Alert.alert('Eliminar', '¿Seguro que desea eliminar esta observación?',
                                                            [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                                                                text: 'OK', onPress: () => {
                                                                    let { observaciones } = this.state;
                                                                    this.setState({ observaciones: observaciones.filter(larow => larow.id !== row.id) });
                                                                }
                                                            },], { cancelable: false },
                                                        );
                                                    }} small primary style={{ backgroundColor: "#c90000", marginLeft: 3, marginRight: 10, borderRadius: 20 }}><Body><Icon name='trash' color={"white"} type="font-awesome" /></Body></Button></Col>
                                            </Grid>
                                        </Row>)
                                    })
                                    }
                                </Grid>
                            </Row>
                        }
                    </Grid>

                    {/* Despliega Modal para agregar una observación a la pregunta */}
                    <Modal animationType="fade" transparent={false} visible={this.state.modal} onRequestClose={() => { Alert.alert('Modal has been closed.'); }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <View style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10, alignItems: 'center' }}>

                                {/* Área para ingresar texto de observación */}
                                <View style={{ marginTop: '3%' }}>
                                    <Icon name='message-text' type='material-community' color={this.props.theme.primary} size={35} resizeMode="contain" />
                                    <Label style={{ fontSize: 18, color: this.props.theme.primary }}>Observación</Label>
                                </View>
                                <Item regular style={{ borderColor: "transparent" }}>
                                    <Content padder>
                                        <Textarea
                                            rowSpan={4}
                                            bordered placeholder=""
                                            autoCapitalize='characters'
                                            value={this.state.comentario}
                                            onChangeText={(value) => { this.setState({ comentario: value }); }}
                                            style={{ backgroundColor: "#ffffff", borderRadius: 6, height: '100%', borderColor: this.props.theme.primary }}
                                        />
                                    </Content>
                                </Item>

                                <View style={{ marginTop: '5%' }}>
                                    {/* <Icon name='camera' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain" /> */}
                                    <Label style={{ fontSize: 16, color: '88898D' }}>Evidencia</Label>
                                </View>

                                {/* Despliega las imágenes tomadas y/o adjuntadas */}
                                {this.state.adjunto !== "" ?
                                    <View style={{ flexGrow: 1, alignItems: 'center' }}>
                                        {this.state.fotos.map((foto, i) =>
                                            <ImageBackground key={i} resizeMode="contain" style={{ height: 170, width: 230, marginTop: '2%' }} source={{ uri: foto.imagen.file, isStatic: true }}>
                                                <Row>
                                                    <Col></Col>
                                                    <Col>
                                                        <Button style={{ backgroundColor: '#c90000', marginLeft: 16, borderRadius: 30, width: 47, height: 47 }} block onPress={() => {
                                                            Alert.alert('Eliminar', '¿Seguro que desea eliminar esta foto?',
                                                                [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                                                                    text: 'OK', onPress: () => {
                                                                        this.deletePhoto(foto);
                                                                    }
                                                                },], { cancelable: false },
                                                            );
                                                        }}>
                                                            <Icon type="FontAwesome" name="close" style={{ fontSize: 20, color: "#ffffff" }} color='#ffffff' />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <Row></Row>
                                                <Row></Row>
                                            </ImageBackground>
                                        )}
                                        <Item regular style={{ borderColor: "transparent", marginTop: '3%', alignItems: 'center' }}>
                                            <Button style={{ backgroundColor: this.props.theme.primary, width: 70, marginRight: 20 }} small onPress={() => { this.takeMultiPhoto(); }}>
                                                <Body>
                                                    <Icon name='camera' type="font-awesome" color={"#FFFFFF"} />
                                                </Body>
                                                <Text>+</Text>
                                            </Button>
                                            {/* <Text>  o</Text> */}
                                            <Button small style={{ backgroundColor: this.props.theme.primary, width: 70, marginLeft: 10 }} onPress={() => { this.searchMultiPhoto() }}>
                                                <Body>
                                                    <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                                                </Body>
                                                <Text>+</Text>
                                            </Button>
                                        </Item>

                                    </View>
                                    :
                                    /* Si aún no hay imagen muestra solo los botones */
                                    <Item regular style={{ borderColor: "transparent", marginTop: '8%', alignItems: 'center' }}>
                                        <Button style={{ backgroundColor: this.props.theme.primary, width: 70, marginRight: 20 }} small onPress={() => { this.takeMultiPhoto() }}>
                                            <Body>
                                                <Icon name='camera' type="font-awesome" color={"#FFFFFF"} />
                                            </Body>
                                            <Text>+</Text>
                                        </Button>
                                        {/* <Text>  o</Text> */}
                                        <Button small style={{ backgroundColor: this.props.theme.primary, width: 70, marginLeft: 10 }} onPress={() => { this.searchMultiPhoto() }}>
                                            <Body>
                                                <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                                            </Body>
                                            <Text>+</Text>
                                        </Button>
                                    </Item>
                                }

                                {/* Select Gravedad Potencial */}
                                {this.state.ifCumple == false ?
                                    <Grid style={{ marginTop: '8%', marginLeft: '5%', marginRight: '5%' }}>
                                        <Label style={{ fontSize: 15, color: this.props.theme.primary, fontWeight: 'bold' }}>
                                            {'Gravedad Potencial'}
                                        </Label>
                                        <Row>
                                            <Col style={{
                                                width: '100%',
                                                borderBottomColor: 'gray',
                                                borderBottomWidth: 2,
                                                fontSize: 14,
                                                minHeight: 50
                                            }}>
                                                <Picker
                                                    style={{ color: 'gray', width: '100%' }}
                                                    note
                                                    mode="dropdown"
                                                    selectedValue={this.state.gravedad}
                                                    onValueChange={(gravedad) => this.setState({ gravedad: gravedad })}
                                                >
                                                    <Picker.Item label={'Seleccione'} value={''} />
                                                    <Picker.Item label={'Alta'} value={'Alta'} />
                                                    <Picker.Item label={'Media'} value={'Media'} />
                                                    <Picker.Item label={'Baja'} value={'Baja'} />
                                                </Picker>
                                            </Col>
                                        </Row>
                                    </Grid>

                                    :
                                    <View></View>
                                }

                                {/* Accion Correctiva */}
                                {this.state.ifCumple == false ?
                                    <Grid style={{ marginTop: '3%', marginLeft: '5%', marginRight: '5%' }}>
                                        <Label
                                            style={{
                                                marginLeft: 5,
                                                marginTop: 15,
                                                marginBottom: '2%',
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                color: this.props.theme.primary,
                                            }}>
                                            {'Accion Correctiva'}
                                        </Label>
                                        <Row>
                                            <Col style={{
                                                width: '100%',
                                                borderBottomColor: 'gray',
                                                borderBottomWidth: 2,
                                                fontSize: 14,
                                                minHeight: 50
                                            }}>
                                                <View style={{ flex: 1, marginLeft: 5, width: '100%' }}>
                                                    <MultiSelect
                                                        hideTags
                                                        hideDropdown
                                                        items={items}
                                                        uniqueKey="name"
                                                        ref={(component) => { this.multiSelect = component }}
                                                        onSelectedItemsChange={this.onSelectedItemsChange}
                                                        selectedItems={accionc}
                                                        selectText="Seleccione..."
                                                        searchInputPlaceholderText="Buscar..."
                                                        onChangeInput={(text) => console.log(text)}
                                                        altFontFamily="ProximaNova-Light"
                                                        tagRemoveIconColor="#CCC"
                                                        tagBorderColor="#CCC"
                                                        tagTextColor="#CCC"
                                                        selectedItemTextColor={this.props.theme.primary}
                                                        selectedItemIconColor={this.props.theme.primary}
                                                        itemTextColor="#000"
                                                        displayKey="name"
                                                        searchInputStyle={{ color: '#CCC' }}
                                                        submitButtonColor={this.props.theme.primary}
                                                        submitButtonText="Aceptar"
                                                        tagContainerStyle={{ width: '100%' }}
                                                        styleTextTag={{ textAlign: 'left', color: 'black' }}
                                                    />
                                                </View>
                                            </Col>
                                        </Row>
                                    </Grid>

                                    :
                                    <View></View>
                                }

                                {/* Calendario para seleccionar fecha */}
                                {this.state.ifCumple == false ?
                                    <View>
                                        <View style={{ marginTop: '5%', alignItems: 'center' }}>
                                            <Icon name='calendar' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain" />
                                            <Label style={{ marginTop: 10, fontSize: 18, color: this.props.theme.primary }}>Fecha de Plazo</Label>
                                        </View>
                                        <View>
                                            <DatePicker
                                                showIcon={false}
                                                customStyles={{
                                                    dateTouchBody: { backgroundColor: 'transparent' }
                                                }}
                                                mode="date"
                                                date={this.state.fecha}
                                                placeholder="___ /___ /___"
                                                format="DD-MM-YYYY"
                                                minDate="01-01-1960"
                                                maxDate="01-01-2040"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                onDateChange={(date) => { this.setState({ fecha: date }) }} />
                                        </View>
                                    </View>
                                    :
                                    <View></View>
                                }

                                {/* Despliega Botonos Cancelar y Guardar del Modal */}
                                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: '5%' }}>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#c90000', margin: 20, borderRadius: 4, width: '40%', height: '60%', paddingTop: '2%' }}
                                        onPress={async () => {
                                            this.setState({ modal: false });
                                        }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '15%', alignItems: 'center' }}>
                                            <Icon size={25} name='close' type='font-awesome' color='#ffffff' />
                                            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Cancelar</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{ backgroundColor: '#00C92F', margin: 20, borderRadius: 4, width: '40%', height: '60%', paddingTop: '2%' }}
                                        onPress={async () => {
                                            let { observaciones } = this.state;
                                            if (this.state.ifCumple == false) {
                                                if (this.state.id !== "") {
                                                    if (this.state.comentario !== "" && this.state.gravedad.length > 0 && this.state.accionc.length > 0) {
                                                        for (var i = 0; i < observaciones.length; i++) {
                                                            if (observaciones[i].id === this.state.id) {
                                                                observaciones[i].fecha = this.state.fecha;
                                                                observaciones[i].comentario = this.state.comentario;
                                                                observaciones[i].fotos = this.state.fotos;
                                                                observaciones[i].gravedad = this.state.gravedad;
                                                                observaciones[i].accionc = this.state.accionc;
                                                            }
                                                        }
                                                        this.setState({ observaciones, modal: false });
                                                    } else {
                                                        Alert.alert('Falta información', `Para guardar debe
                                                                                      ${this.state.comentario == "" ? ' - Ingresar observación.' : ''}
                                                                                      ${this.state.gravedad.length == 0 ? ' - Seleccionar Gravedad Potencial.' : ''}
                                                                                      ${this.state.accionc.length == 0 ? ' - Seleccionar Accion Correctiva.' : ''}`);
                                                    }
                                                } else {
                                                    if (this.state.comentario !== "" && this.state.gravedad.length > 0 && this.state.accionc.length > 0) {
                                                        observaciones.push({
                                                            id: getUID(),
                                                            fecha: this.state.fecha,
                                                            comentario: this.state.comentario,
                                                            fotos: this.state.fotos,
                                                            gravedad: this.state.gravedad,
                                                            accionc: this.state.accionc
                                                        });
                                                        this.setState({ observaciones, modal: false });
                                                    } else {
                                                        Alert.alert('Falta información', `Para guardar debe 
                                                                                      ${this.state.comentario == "" ? ' - Ingresar observación.' : ''}
                                                                                      ${this.state.gravedad.length == 0 ? ' - Seleccionar Gravedad Potencial.' : ''}
                                                                                      ${this.state.accionc.length == 0 ? ' - Seleccionar Accion Correctiva.' : ''}`);
                                                    }
                                                }
                                            } else {
                                                if (this.state.id !== "") {
                                                    if (this.state.comentario !== "") {
                                                        for (var i = 0; i < observaciones.length; i++) {
                                                            if (observaciones[i].id === this.state.id) {
                                                                observaciones[i].fecha = this.state.fecha;
                                                                observaciones[i].comentario = this.state.comentario;
                                                                observaciones[i].fotos = this.state.fotos;
                                                                observaciones[i].gravedad = this.state.gravedad;
                                                                observaciones[i].accionc = this.state.accionc;
                                                            }
                                                        }
                                                        this.setState({ observaciones, modal: false });
                                                    } else {
                                                        Alert.alert('Falta información', `Para guardar debe
                                                                                          ${this.state.comentario == "" ? ' - Ingresar observación.' : ''}`);
                                                    }
                                                } else {
                                                    if (this.state.comentario !== "") {
                                                        observaciones.push({
                                                            id: getUID(),
                                                            fecha: this.state.fecha,
                                                            comentario: this.state.comentario,
                                                            fotos: this.state.fotos,
                                                            gravedad: this.state.gravedad,
                                                            accionc: this.state.accionc
                                                        });
                                                        this.setState({ observaciones, modal: false });
                                                    } else {
                                                        Alert.alert('Falta información', `Para guardar debe 
                                                                                          ${this.state.comentario == "" ? ' - Ingresar observación.' : ''}`);
                                                    }
                                                }
                                            }
                                            //this.setState({observaciones,modal:false});         
                                            this.props.setValorControl(this.props.id, this.props.tipo, "observaciones", observaciones);
                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '15%', alignItems: 'center' }}>
                                            <Icon size={25} name='save' color='#ffffff' />
                                            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Guardar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </Modal>
                    {this.props.renderizar(this.props)}
                </View >



        );
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.reducerValores,
        check_activo: state.reducerCheckActivo,
        check_default_values: state.reducerCheckDefaultValues
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
        setCheckActivo: (_value) => { dispatch(actionSetCheckActivo(_value)); },
        setCheckDefaultValues: (_values) => { dispatch(actionSetCheckDefaultValues(_values)); },
        updateDoc: (docId) => { dispatch(actionUpdateDoc(docId)); }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckMMH);

