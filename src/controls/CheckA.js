import React, { Component, PureComponent } from 'react';
import { Input, Item, Label, Text, Button, Textarea, Content, Body, Badge, List, ListItem } from 'native-base'
import { View, Image, Alert, Modal, ScrollView, TouchableOpacity, ImageBackground, PermissionsAndroid } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { actionSetValorControl, actionSetCheckActivo, actionSetCheckDefaultValues } from '../store/actions'
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements'
import { getUID } from '../functions/common'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { FlatList } from 'react-native';
import { FontIcon } from '../components/custom/FontIcon';

const optionsPhotos = {
  title: 'Seleccione imagen',
  quality: 0.8,
  maxWidth: 420,
  maxHeight: 560,
  includeBase64: true
};

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

class CheckA extends React.Component {

  state = {
    opciones: [],
    toolbar: false,
    pregunta: "",
    ponderacion: "",
    pagina: "",
    plazo: null,
    search: "",

    id: "",
    fecha: "",
    comentario: "",
    responsable: "",
    adjunto: "",
    presionado: { codigo: "", time: 0 },
    modal: false,
    modalResponsable: false,
    observaciones: [],
    fotos: [],
    img: "",
    multimagen: false,
    data: [],
    data_filtrada: [],

    ifCumple: false,
    ifNocumple: false,
    ifNoaplica: false,
    msj: "Primero debe calificar y seleccionar una pregunta para hacer un Acuerdo."
  }

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

  setSearchValue(search) {
    let data_filtrada = [...this.state.data];
    data_filtrada = data_filtrada.filter(row => {
      let valor = '';
      for (const element in row) {
        valor += typeof (row[element]) === 'string' ? row[element] : '';
      }
      return valor.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    this.setState({ data_filtrada, search });
  }

  UNSAFE_componentWillMount() {
    const configs = this.props.configs;

    let opciones = JSON.parse(configs.filter(row=>row.Nombre === "opciones")[0].Valor);

    const presionado  = JSON.parse(this.props.valores.filter(row=>row.Nombre==="presionado")[0].Valor)

    let observaciones = [];

    if(this.props.valores.filter(row=>row.Nombre==="observaciones")[0].Valor != '""')
    {
      observaciones = JSON.parse(this.props.valores.filter(row=>row.Nombre==="observaciones")[0].Valor)
    }

    let nombre_lista = configs.filter(row => row.Nombre === 'lista_responsables')[0].Valor;
    let lista = this.props.listas.filter(row => row.Codigo === nombre_lista);
    let data = [];
    if (lista.length > 0) {
      data = lista[0].Items;
    } else {
      Alert.alert(
        'Cuidado',
        "La lista '" +
          nombre_lista +
          "' no esta disponible. Revise la configuración del formulario.",
      );
    }

    let configPlazo = configs.filter(row=>row.Nombre==="plazo");
    let plazo = null;
    if (configPlazo.length) {
      plazo = JSON.parse(configPlazo[0].Valor);
    }

    this.setState({
      pregunta:configs.filter(row=>row.Nombre === "pregunta")[0].Valor,
      ponderacion:configs.filter(row=>row.Nombre === "ponderacion")[0].Valor,
      opciones,
      presionado:{codigo:presionado,time:(new Date()).getTime()},
      observaciones,
      data,
      data_filtrada: data,
      plazo
    });
  }

  _renderOptions = (active) => {
    let presionado = this.state.presionado.codigo;
    if (this.props.check_default_values !== []) {
      for (var ii = 0; ii < this.props.check_default_values.length; ii++) {
        if (this.props.check_default_values[ii].id === this.props.id && this.props.check_default_values[ii].time > this.state.presionado.time) {
          presionado = this.props.check_default_values[ii].value;
        }
      }
    }

    return this.state.opciones.map((item, i) => {

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
                this.setState({ ifCumple: true, ifNoaplica: false, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, msj: "Primero debe calificar y seleccionar una pregunta para agregar un Acuerdo." });
              } else if (opciones[i].codigo === "no") {
                this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                this.setState({ ifCumple: false, ifNoaplica: false, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, msj: "Primero debe calificar y seleccionar una pregunta para agregar un Acuerdo." });
              } else {
                if (this.state.observaciones.length !== 0) {
                  Alert.alert('¡Atención!', 'Al macar como No Aplica se eliminarán los acuerdos de esta pregunta.',
                    [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                      text: 'OK', onPress: () => {
                        this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                        this.props.setValorControl(this.props.id, this.props.tipo, "observaciones", "");
                        this.setState({ ifCumple: false, ifNoaplica: true, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, observaciones: [], msj: "No puede ingresar un acuerdo en un No Aplica." });
                      }
                    },], { cancelable: false },
                  );
                } else {
                  this.props.setValorControl(this.props.id, this.props.tipo, "presionado", item.codigo);
                  this.setState({ ifCumple: false, ifNoaplica: true, presionado: { codigo: item.codigo, time: (new Date()).getTime() }, msj: "No puede ingresar un acuerdo en un No Aplica." });
                }
              }

              //NUEVA FUN. MARK ANOTHER OPTION AND ANOTHER HIDE
              let nuevo = [];

              if (this.state.opciones.filter(row => row.codigo === item.codigo)[0]["markAnotherOption"]) {
                const markAnotherOption = this.state.opciones.filter(row => row.codigo === item.codigo)[0]["markAnotherOption"];
                for (var a = 0; a < markAnotherOption.length; a++) {
                  this.props.setValorControl(markAnotherOption[a][0], this.props.tipo, "presionado", markAnotherOption[a][1]);
                  nuevo.push({ id: markAnotherOption[a][0], action: "mark", value: markAnotherOption[a][1], time: (new Date()).getTime() });
                }
              }

              if (this.state.opciones.filter(row => row.codigo === item.codigo)[0]["hideAnotherOption"]) {
                const hideAnotherOption = this.state.opciones.filter(row => row.codigo === item.codigo)[0]["hideAnotherOption"];
                for (var a = 0; a < hideAnotherOption.length; a++) {
                  nuevo.push({ id: hideAnotherOption[a], action: "hide", value: "", time: 0 }); //PARA ESTE CASO NO APLICA EL VALUE Y EL TIME
                }
              }

              if (this.state.opciones.filter(row => row.codigo === item.codigo)[0]["showAnotherOption"]) {
                const showAnotherOption = this.state.opciones.filter(row => row.codigo === item.codigo)[0]["showAnotherOption"];
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
          <Icon name={iconName} type={iconLibrary} color={color} size={38} resizeMode="contain" />
        </Col>
      )
    })
  }

  render() {
    requestCameraPermission();
    let active = true;
    if (this.props.check_default_values !== []) {
      for (var ii = 0; ii < this.props.check_default_values.length; ii++) {
        if (this.props.check_default_values[ii].action === "hide" && this.props.check_default_values[ii].id === this.props.id) {
          active = false;
        }
      }
    }

    return (<View>
      <Grid style={{ borderRadius: 10, margin: 5, padding: 10, backgroundColor: "#FFFFFF" }} onPress={() => {
        if (this.state.presionado.codigo !== "" && active === true) {
          this.props.setCheckActivo(this.props.id);
          this.setState({ toolbar: true });
        }
      }}>
        {/* Muestra las pregunta del check */}
        <Row>
          <Col style={{ flex: 6, borderColor: "grey", borderWidth: 1, borderRadius: 20 }}>
            <Text style={{ fontSize: 16, margin: 10, color: 'black' }}>
              {this.props.orden}.{this.state.pregunta}
            </Text>
          </Col>
          <Col>
            <Col style={{ flex: 0 }}>
              {this._renderOptions(active)}
              {(this.state.toolbar === true && this.props.check_activo === this.props.id && active === true && this.state.ifNoaplica == false) ? (
                <Icon name='plus' type='font-awesome' color='gray' size={38} resizeMode="contain" onPress={() => {
                  let manana_format = null;
                  if (this.state.plazo) {
                    const manana = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000 * this.state.plazo);
                    manana_format = ('0' + manana.getDate()).slice(-2) + '-' + ('0' + (manana.getMonth() + 1)).slice(-2) + '-' + manana.getFullYear();
                  }
                  this.setState({ modal: true, fecha: manana_format, comentario: "", adjunto: "", id: "", fotos: [], responsable: "" });
                }} />)
                : (
                  <Icon name='plus' type='font-awesome' color='gray' size={38} resizeMode="contain" onPress={() => {
                    Alert.alert('¡Atención!', this.state.msj);
                  }} />
                )
              }
            </Col>
            <Col style={{ flex: 1 }}></Col>
          </Col>
        </Row>

        {/* Muestra Label con cantidad de observaciones bajo cada pregunta */}
        {(this.state.toolbar === true) &&
          <Row>
            <Grid style={{ marginTop: 10 }}>
              {this.state.observaciones.length > 0 && <Text style={{ marginTop: 2, fontSize: 12, marginLeft: 1, color: this.props.theme.primary }}>{this.state.observaciones.length === 1 ? "1 Acuerdo" : this.state.observaciones.length + " Acuerdos"}</Text>}
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
                    <Col>{<Button onPress={() => {
                      //EDITAR:
                      this.setState({ modal: true, fecha: row.fecha, comentario: row.comentario, adjunto: row.adjunto, id: row.id, fotos: row.fotos, responsable: row.responsable });
                    }} small primary style={{ backgroundColor: this.props.theme.tertiary, marginLeft: 3, borderRadius: 20 }}><Body><Icon name='edit' color={"white"} type="font-awesome" /></Body></Button>}</Col>
                    <Col><Button onPress={() => {
                      //ELIMINAR:
                      Alert.alert('Eliminar', '¿Seguro que desea eliminar este acuerdo?',
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
      <Modal animationType="fade" transparent={false} visible={this.state.modal} onRequestClose={() => { this.setState({ modal: false }) }}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10, alignItems: 'center' }}>

            {/* Área para ingresar texto de observación */}
            <View style={{ marginTop: '5%', alignItems: 'center' }}>
              <FontIcon font="MaterialIconsRegular.ttf" code={57545} color={this.props.theme.primary} size={24} resizeMode="contain" />
              <Label style={{ fontSize: 18, color: this.props.theme.primary }}>Acuerdo</Label>
            </View>
            <Item regular style={{ borderColor: "transparent" }}>
              <Content padder>
                <Textarea autoCapitalize='characters' value={this.state.comentario} rowSpan={4} bordered placeholder="" onChangeText={(value) => { this.setState({ comentario: value }); }} style={{ backgroundColor: "#ffffff", borderRadius: 20, height: '100%', borderColor: this.props.theme.primary }} />
              </Content>
            </Item>

            <View style={{ marginTop: '5%' }}>
              <Label style={{ fontSize: 18, color: this.props.theme.primary }}>Evidencia</Label>
            </View>
            <Item regular style={{ borderColor: "transparent", marginTop: 10, flexDirection: "row" }}>
              <Button style={{ backgroundColor: this.props.theme.primary, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }} small onPress={() => { this.takeMultiPhoto() }}>
                <Text>+</Text>
                <FontIcon font="MaterialIconsRegular.ttf" code={58386} size={24} color={"#FFFFFF"} />
              </Button>
              <View style={{ width: 20 }}></View>
              <Button style={{ backgroundColor: this.props.theme.primary, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }} small onPress={() => { this.searchMultiPhoto() }}>
                <Text>+</Text>
                <FontIcon font="MaterialIconsRegular.ttf" code={57894} size={24} color={"#FFFFFF"} />
              </Button>
            </Item>

            {/* Despliega las imágenes tomadas y/o adjuntadas */}
            {this.state.adjunto !== "" ?
              <View style={{ flexGrow: 1 }}>
                {this.state.fotos.map((foto, i) =>
                  <ImageBackground key={i} resizeMode="contain" style={{ height: 170, width: 230, marginTop: 10 }} source={{ uri: foto.imagen.file, isStatic: true }}>
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
              </View>
              :
              <View></View>
            }

            {/* Calendario para seleccionar fecha */}
            <View>
              <View style={{ marginTop: '10%', alignItems: 'center' }}>
                <FontIcon font="MaterialIconsRegular.ttf" code={59701} size={24} color={this.props.theme.primary} />
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

            <View>
              <View style={{ marginTop: '10%', alignItems: 'center' }}>
                <FontIcon font="MaterialIconsRegular.ttf" code={59965} color={this.props.theme.primary} resizeMode="contain" />
                <Label style={{ marginTop: 10, fontSize: 18, color: this.props.theme.primary }}>Responsable</Label>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalResponsable: true });
                  }}
                  style={{
                    borderBottomColor: this.props.baseColor.Valor,
                    borderBottomWidth: 2,
                    fontSize: 14,
                    minHeight: 35,
                    marginTop: 10
                  }}>
                  <Text>{this.state.responsable}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Item regular style={{ borderColor: "transparent", marginTop: "10%", flexDirection: "row" }}>
              <Button style={{ backgroundColor: "#c90000", paddingLeft: 10, paddingTop: 5, paddingBottom: 5 }} small
                onPress={async () => {
                  this.setState({ modal: false });
                }}>
                <FontIcon font="MaterialIconsRegular.ttf" code={58829} size={24} color={"#FFFFFF"} />
                <Text>CANCELAR</Text>
              </Button>
              <View style={{ width: 20 }}></View>
              <Button style={{ backgroundColor: "#00c92f", paddingLeft: 10, paddingTop: 5, paddingBottom: 5 }} small
                onPress={async () => {
                  let { observaciones } = this.state;
                  if (this.state.id !== "") {
                    if (this.state.comentario === "") {
                      Alert.alert('Falta información', 'Para guardar debe ingresar un acuerdo');
                    } else if (this.state.responsable === "") {
                      Alert.alert('Falta información', 'Para guardar debe ingresar un responsable');
                    } else if (this.state.fecha === null) {
                      Alert.alert('Falta información', 'Para guardar debe ingresar una fecha');
                    } else {
                      for (var i = 0; i < observaciones.length; i++) {
                        if (observaciones[i].id === this.state.id) {
                          observaciones[i].fecha = this.state.fecha;
                          observaciones[i].comentario = this.state.comentario;
                          observaciones[i].fotos = this.state.fotos;
                          observaciones[i].responsable = this.state.responsable;
                        }
                      }
                      this.setState({ observaciones, modal: false });
                    }
                  } else {
                    if (this.state.comentario === "") {
                      Alert.alert('Falta información', 'Para guardar debe ingresar un acuerdo');
                    } else if (this.state.responsable === "") {
                      Alert.alert('Falta información', 'Para guardar debe ingresar un responsable');
                    } else if (this.state.fecha === null) {
                      Alert.alert('Falta información', 'Para guardar debe ingresar una fecha');
                    } else {
                      console.log(this.state.fecha);
                      observaciones.push({
                        id: getUID(),
                        fecha: this.state.fecha,
                        comentario: this.state.comentario,
                        fotos: this.state.fotos,
                        responsable: this.state.responsable
                      });
                      this.setState({ observaciones, modal: false });
                    }
                  }
                  //this.setState({observaciones,modal:false});         
                  this.props.setValorControl(this.props.id, this.props.tipo, "observaciones", observaciones);
                }}>
                <FontIcon font="MaterialIconsRegular.ttf" code={57894} size={24} color={"#FFFFFF"} />
                <Text>GUARDAR</Text>
              </Button>
            </Item>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        onRequestClose={() => {
          this.setState({ modalResponsable: false });
        }}
        hardwareAccelerated={true}
        animationType="slide"
        transparent={true}
        visible={this.state.modalResponsable}>
        <View
          style={{
            paddingTop: '12%',
            flex: 1,
            flexDirection: 'column-reverse',
            backgroundColor: 'white'
          }}>
          <Item
            regular
            style={{
              borderColor: 'transparent',
              backgroundColor: 'white',
            }}>
            <Icon type="FontAwesome" active name="search" />
            <Input
              autoFocus
              style={{
                borderBottomColor: this.props.baseColor.Valor,
                borderBottomWidth: 2,
              }}
              value={this.state.search}
              onChangeText={value => {
                this.setSearchValue(value);
              }}
              autoCapitalize="characters"
              placeholder="Buscar"
            />
            <Icon raised name="check" color={this.props.baseColor.Valor} onPress={() => {
              this.setState({
                modalResponsable: false,
                responsable: this.state.search,
                search: "",
                data_filtrada: this.state.data
              });
            }} />
          </Item>

          <List
            style={{
              borderBottomColor: this.props.baseColor.Valor,
              borderBottomWidth: 2,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 2,
              backgroundColor: 'white'
            }}>
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              data={this.state.data_filtrada}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              renderItem={({ item }) => (
                <ListItem
                  noIndent
                  style={{
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      modalResponsable: false,
                      responsable: item.Texto1,
                      search: "",
                      data_filtrada: this.state.data
                    });
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
      {this.props.renderizar(this.props)}
    </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    check_activo: state.reducerCheckActivo,
    check_default_values: state.reducerCheckDefaultValues
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
    setCheckActivo: (_value) => { dispatch(actionSetCheckActivo(_value)); },
    setCheckDefaultValues: (_values) => { dispatch(actionSetCheckDefaultValues(_values)); },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckA);