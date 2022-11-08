import React, {Component, PureComponent} from 'react';
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
  Picker,
  Content,
} from 'native-base';
import {
  View,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {actionSetValorControl, actionUpdateDoc} from '../store/actions';
import {Col, Row, Grid} from 'react-native-easy-grid';

class Lista extends Component {
  state = {
    data: [],
    titulo: '',
    valor: null,
    isDataStatic: false,
    filter: null,
  };

  componentDidMount() {
    const configs = this.props.configs;
    const valores = this.props.valores;

    let titulo = configs.filter(row => row.Nombre === 'titulo')[0].Valor;
    let valor = valores.filter(row => row.Nombre === 'seleccionado')[0].Valor;
    let isDataStatic = false;
    let data = [];
    let filter = {};

    //ANALIZAR SI EXISTE CONFIGURACION DE "DATOS"
    if (configs.filter(row => row.Nombre === 'datos').length > 0) {
      data = JSON.parse(configs.filter(row => row.Nombre === 'datos')[0].Valor);
      isDataStatic = true;
    } else {
      //PENDIENTE VALIDAR SI EXISTE UNA LISTA (SE DA POR HECHO ACTUALMENTE)
      let nombre_lista = configs.filter(row => row.Nombre === 'lista')[0].Valor;
      let lista = this.props.listas.filter(row => row.Codigo === nombre_lista);
      data = lista[0].Items || [];
      isDataStatic = false;
    }
    if (configs.filter(row => row.Nombre === 'filter').length > 0) {
      filter = JSON.parse(
        configs.filter(row => row.Nombre === 'filter')[0].Valor,
      );
    }

    this.setState({titulo, valor, data, isDataStatic, filter});
  }

  render() {
    function fetchFromObject(obj, prop){
      //property not found
      if(typeof obj === 'undefined') return false;
      
      //index of next property split
      var _index = prop.indexOf('.')
  
      //property split found; recursive call
      if(_index > -1){
          //get object at property (before split), pass on remainder
          return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index+1));
      }
      
      //no split; get property
      return obj[prop];
    }

    let {data} = this.state;

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
        data = data.filter(
          row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
        );
      }
    }

    return (
      <View>
        <View>
          <Item regular style={{borderColor: 'transparent', borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2 }}>
            <Grid style={{marginTop: 10}}>
              <Row>
                <Col>
                  <Label style={{marginLeft: 5,fontSize: 14,marginTop: 15,color: this.props.baseColor.Valor, fontWeight: 'bold'}}>
                    {this.state.titulo.toUpperCase()}
                  </Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Picker style={{color: this.props.baseColor.Valor}} 
                    note mode="dropdown"
                    selectedValue={
                      this.state.valor !== '' && this.state.valor !== null ? this.state.valor : ''
                    }
                    onValueChange={valor => {
                      if (valor !== '') {
                        const elvalor = JSON.parse(valor);
                        if (this.state.isDataStatic === false) {
                          this.props.setValorControl(this.props.id,this.props.tipo,'seleccionado',elvalor);
                          this.props.updateDoc(this.props.id);
                        } else {
                          this.props.setValorControl(this.props.id,this.props.tipo,'seleccionado',elvalor);
                          this.props.updateDoc(this.props.id);
                        }
                      } else {
                        this.props.setValorControl(this.props.id,this.props.tipo,'seleccionado','');
                        this.props.updateDoc(this.props.id);
                      }
                      this.setState({valor});
                    }}>
                    <Picker.Item label={'Seleccione'} value={''} />
                    {this.state.isDataStatic === true
                      ? data.map((item, i) => {
                          return (
                            <Picker.Item
                              label={item.Nombre.toUpperCase()}
                              key={i}
                              value={JSON.stringify(item.Valor)}
                            />
                          );
                        })
                      : data.map((item, i) => {
                          return (
                            <Picker.Item
                              label={item.Texto1.toUpperCase()}
                              key={i}
                              value={JSON.stringify(item.Texto2)}
                            />
                          );
                        })}
                  </Picker>
                </Col>
              </Row>
            </Grid>
          </Item>
        </View>
        {this.props.renderizar(this.props)}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    //listas: state.reducerListas,
    globalValues: state.reducerValores,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => {
      dispatch(actionSetValorControl(_id, _tipo, _clave, _valor));
    },
    updateDoc:(docId)=>{dispatch(actionUpdateDoc(docId));}  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lista);
