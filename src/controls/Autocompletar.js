import React, { Component, PureComponent } from 'react';
import {
  Input,
  Item,
  Label,
  List,
  ListItem,
  Text,
  Right,
  Body,
  Icon,
  Col,
  Row,
} from 'native-base';
import {
  View,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { actionSetValorControl } from '../store/actions';

let empresas = [];
empresas['mutual_achs'] = require('../project/images/empresas/mutual_achs.png');
empresas['mutual_isl'] = require('../project/images/empresas/mutual_isl.png');
empresas['mutual_ist'] = require('../project/images/empresas/mutual_ist.png');
empresas[
  'mutual_mutual'
] = require('../project/images/empresas/mutual_mutual.png');
empresas['mutual_nada'] = require('../project/images/empresas/mutual_nada.png');

class Autocompletar extends Component {
  state = {
    data: [],
    data_filtrada: [],
    modalVisible: false,
    seleccionado: null,
    titulo: '',
    search: '',
    visibleApp: true,
    labels: '',
    filter: null,
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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

  componentDidMount() {
    const configs = this.props.configs;
    const valores = this.props.valores;

    let visibleApp = true;
    let titulo = configs.filter(row => row.Nombre === 'titulo')[0].Valor;
    let nombre_lista = configs.filter(row => row.Nombre === 'lista')[0].Valor;
    let labels = '';
    let valor = JSON.parse(
      valores.filter(row => row.Nombre === 'seleccionado')[0].Valor,
    );
    let filter = {};

    if (configs.filter(row => row.Nombre === 'labels').length > 0) {
      labels = configs.filter(row => row.Nombre === 'labels')[0].Valor;
      labels = labels.split(';');
    }

    if (configs.filter(row => row.Nombre === 'visibleApp').length > 0) {
      //Alert.alert("",configs.filter(row=>row.Nombre === "visibleApp")[0].Valor);
      visibleApp = JSON.parse(
        configs
          .filter(row => row.Nombre === 'visibleApp')[0]
          .Valor.toLowerCase(),
      );
    }

    if (configs.filter(row => row.Nombre === 'filter').length > 0) {
      filter = JSON.parse(
        configs.filter(row => row.Nombre === 'filter')[0].Valor,
      );
    }

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

    this.setState({
      data,
      titulo,
      seleccionado: valor,
      data_filtrada: data,
      visibleApp,
      labels,
      filter,
    });
  }

  showFromType(_label, _value) {
    let sp = _label.split(',');
    if (sp[1] === 'text') {
      return (
        <Text note>
          {sp[0]}: {_value}
        </Text>
      );
    }
    if (sp[1] === 'img') {
      return (
        <View>
          <Row>
            <Col></Col>
            <Col style={{ justifyContent: 'center' }}>
              <Image
                source={empresas[_value]}
                style={{ width: 150, height: 100 }}
                resizeMode="stretch"></Image>
            </Col>
            <Col></Col>
          </Row>
        </View>
      );
    }
    return <Text note></Text>;
  }

  //Nombre,text;Rut,text;Apr,text;Representante Legal,text;Organización Administradora,img

  render() {
    function fetchFromObject(obj, prop) {
      //property not found
      if (typeof obj === 'undefined') return false;

      //index of next property split
      var _index = prop.indexOf('.')

      //property split found; recursive call
      if (_index > -1) {
        //get object at property (before split), pass on remainder
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
      }

      //no split; get property
      return obj[prop];
    }

    if (this.state.visibleApp === false) {
      return <View></View>;
    } else {
      let { data_filtrada } = this.state;
      //EXISTE ALGUN FILTRO QUE APLICAR A ESTA LISTA
      if (this.state.filter !== null) {
        //FILTRAR LA DATA LOCAL DE ACUERDO A PARAMETROS GLOBALES (EL VALOR DE OTRA LISTA EXISTENTE) [{id,tipo,clave,valor}]
        let remoteValue = this.props.globalValues.filter(row => {
          const idregex = new RegExp(
            `^${this.state.filter.fromId}[A-Z][a-zA-Z0-9]*$`,
            'ig'
          );
          return idregex.test(row.id);
        });
        if (remoteValue.length == 1) {
          data_filtrada = data_filtrada.filter(
            row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
          );
        }
      }

      let Texto1 = '',
        Texto2 = '',
        Texto3 = '',
        Texto4 = '',
        Texto5 = '',
        Texto6 = '',
        Texto7 = '';
      if (this.state.seleccionado) {
        if (this.state.seleccionado.Texto1)
          Texto1 = this.state.seleccionado.Texto1;
        if (this.state.seleccionado.Texto2)
          Texto2 = this.state.seleccionado.Texto2;
        if (this.state.seleccionado.Texto3)
          Texto3 = this.state.seleccionado.Texto3;
        if (this.state.seleccionado.Texto4)
          Texto4 = this.state.seleccionado.Texto4;
        if (this.state.seleccionado.Texto5)
          Texto5 = this.state.seleccionado.Texto5;
        if (this.state.seleccionado.Texto6)
          Texto6 = this.state.seleccionado.Texto6;
        if (this.state.seleccionado.Texto7)
          Texto7 = this.state.seleccionado.Texto7;
      }
      return (
        <View>
          <View style={{ marginTop: 5 }}>
            <Label
              style={{
                marginLeft: 5,
                marginTop: 15,
                fontSize: 14,
                color: this.props.baseColor.Valor,
                fontWeight: 'bold'
              }}>
              {this.state.titulo.toUpperCase()}
            </Label>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}
              style={{
                borderBottomColor: this.props.baseColor.Valor,
                borderBottomWidth: 2,
                fontSize: 14,
                minHeight: 50,
                paddingLeft: 10,
                paddingVertical: 10
              }}>
              {Texto1 !== '' && <Text>{Texto1}</Text>}
              {Texto2 !== '' && <Text note>{Texto2}</Text>}

              {Texto3 !== '' && this.state.labels[2]
                ? this.showFromType(this.state.labels[2], Texto3)
                : null}
              {Texto4 !== '' && this.state.labels[3]
                ? this.showFromType(this.state.labels[3], Texto4)
                : null}
              {Texto5 !== '' && this.state.labels[4]
                ? this.showFromType(this.state.labels[4], Texto5)
                : null}
              {Texto6 !== '' && this.state.labels[5]
                ? this.showFromType(this.state.labels[5], Texto6)
                : null}
              {Texto7 !== '' && this.state.labels[6]
                ? this.showFromType(this.state.labels[6], Texto7)
                : null}
            </TouchableOpacity>
            <Modal
              onRequestClose={() => {
                this.setModalVisible(false);
              }}
              hardwareAccelerated={true}
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}>
              <View
                style={{
                  paddingTop: '6%',
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
                </Item>

                <List
                  style={{
                    borderBottomColor: this.props.baseColor.Valor,
                    borderBottomWidth: 2,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: '5%',
                    backgroundColor: 'white'
                  }}>
                  <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={data_filtrada}
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
                          this.setModalVisible(false);
                          this.props.setValorControl(
                            this.props.id,
                            this.props.tipo,
                            'seleccionado',
                            { ...item },
                          );
                          this.setState({ seleccionado: item });
                        }}>
                        <View>
                          <Text note style={{ alignSelf: 'stretch' }}>
                            {item.Texto2}
                          </Text>
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
          </View>
          {this.props.renderizar(this.props)}
        </View>
      );
    }
  }
}

{
  /* <View>
<View style={{marginTop: 5}}>
    <Label style={{marginLeft:5,marginTop:15,fontSize:14,color:"grey"}}>{this.state.titulo.toUpperCase()}</Label>
    <TouchableOpacity onPress={() => {this.setModalVisible(true);}} style={{borderRadius:10,borderColor:"#cbcbcb",backgroundColor:"#eaeaea",borderWidth:0.5,padding:4,fontSize:14,minHeight:50}}>

        {Texto1!=="" && <Text>{Texto1}</Text>}
        {Texto2!=="" && <Text note>{Texto2}</Text>}

        {(Texto3!=="" && this.state.labels[2]) ? this.showFromType(this.state.labels[2],Texto3) : null}
        {(Texto4!=="" && this.state.labels[3]) ? this.showFromType(this.state.labels[3],Texto4) : null}
        {(Texto5!=="" && this.state.labels[4]) ? this.showFromType(this.state.labels[4],Texto5) : null}
        {(Texto6!=="" && this.state.labels[5]) ? this.showFromType(this.state.labels[5],Texto6) : null}
        {(Texto7!=="" && this.state.labels[6]) ? this.showFromType(this.state.labels[6],Texto7) : null}

    </TouchableOpacity>
    <Modal onRequestClose={()=>{this.setModalVisible(false);}}
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}>
        <View style={{paddingTop: 22,backgroundColor:"#ffffff",flex:1,flexDirection:"column"}}>
            <Item regular style={{borderColor:"transparent",backgroundColor:"#ffffff"}}>
                <Icon active name='search' />
                <Input autoFocus
                    style={{borderRadius:10,borderColor:"#ababab",backgroundColor:"#ffffff",borderWidth:0.8,fontSize:16,marginLeft:10,marginRight:10,paddingTop:2,paddingBottom:2}}
                    value={this.state.search}
                    onChangeText={(value)=>{this.setSearchValue(value)}}
                    autoCapitalize='characters'/>
            </Item>

            <List
                    style={{
                    marginLeft:10,
                    marginRight:10,
                    marginBottom:10,
                    borderColor:"#bbbbbb",
                    borderWidth:0.5,
                    }}
                    >
            <FlatList keyboardShouldPersistTaps={'handled'}
            data={data_filtrada}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            renderItem={({item}) => 
            <ListItem noIndent style={{paddingTop:2,paddingBottom:2,paddingLeft:5,paddingRight:5}}
            onPress={() => {
                this.setModalVisible(false);
                this.props.setValorControl(this.props.id,this.props.tipo,"seleccionado",{...item});
                this.setState({seleccionado:item});
            }}>
                <View>
                    <Text note style={{alignSelf:'stretch'}}>{item.Texto2}</Text>
                    <Text style={{alignSelf:'stretch'}}>{item.Texto1}</Text>
                </View>
            </ListItem>
            }/>
            </List>
        </View>
    </Modal>
</View>
{this.props.renderizar(this.props)}</View> */
}

const mapStateToProps = state => {
  return {
    globalValues: state.reducerValores,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => {
      dispatch(actionSetValorControl(_id, _tipo, _clave, _valor));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Autocompletar);
