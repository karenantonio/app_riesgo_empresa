import React, {Component} from 'react';
import {Input,Item,Label,Textarea,Content,Text, Body} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {View} from 'react-native';
import {actionSetValorControl} from '../store/actions'
import { connect } from 'react-redux';
import { map } from 'core-js/fn/array';

class PendienteACH extends Component{

    state = {
        data_ach: [],
        filter: null
    };

    componentDidMount() {
        const configs = this.props.configs;

        let data_ach = [];
        let filter = {};
    
        //Tomar data de los pendientes
        let nombre_lista_ach = configs.filter(row => row.Nombre === 'lista_ach')[0].Valor; // Acta de Reuniones

        let lista_ach = this.props.listas.filter(row => row.Codigo === nombre_lista_ach); // Acta de Reuniones

        if (lista_ach.length > 0) {
            data_ach = lista_ach[0].Items;
        }

        //Filtro por empresa
        if (configs.filter(row => row.Nombre === 'filter').length > 0) {
          filter = JSON.parse(
            configs.filter(row => row.Nombre === 'filter')[0].Valor,
          );
        }
    
        this.setState({data_ach, filter});
    }

    render(){
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

        let {data_ach} = this.state;

        if (this.state.filter !== null) {
            try {
                //FILTRAR LA DATA LOCAL DE ACUERDO A PARAMETROS GLOBALES (EL VALOR DE OTRA LISTA EXISTENTE) [{id,tipo,clave,valor}]
                let remoteValue = this.props.globalValues.filter(row => {
                    const idregex = new RegExp(
                    `^${this.state.filter.fromId}[A-Z][a-zA-Z0-9]*$`,
                    'ig'
                    );
                    return idregex.test(row.id);
                });
                if (remoteValue.length == 1) {
                    data_ach = data_ach.filter(
                    row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
                    );
                }
                
            } catch (error) {
                console.log(error);
            }
        }

        return( 
            <View>        
                <Grid>
                    <Row style={{justifyContent:'center', marginTop:10}}>
                        <Text style={{fontSize:16,color: this.props.theme.primary, fontWeight: 'bold'}}>{'PENDIENTES MONITOREO ACH'}</Text>
                    </Row>    
                </Grid>
                {data_ach.length > 0 ? 
                    <View>
                        {data_ach.map((item, i) => 
                            <Item key={i} regular style={{borderWidth:10,borderRadius:20,padding:10,margin:10,backgroundColor: 'transparent', borderColor:'black'}}>                       
                                <Grid>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{'Fecha de Plazo: '+item.Texto4}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary, fontWeight: 'bold'}}>{item.Texto2}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{item.Texto3}</Text>
                                    </Row>
                                </Grid>
                            </Item>
                        )}
                    </View>
                :
                    <Item regular style={{borderWidth:10,borderRadius:20,padding:10,margin:10,backgroundColor: 'transparent', borderColor:'black'}}>                       
                        <Grid>
                            <Row style={{justifyContent:'center'}}>
                                <Text style={{fontSize:14,color: this.props.theme.primary}}>{'No hay incumplimientos pendientes.'}</Text>
                            </Row>
                        </Grid>
                    </Item>
                }
                        
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
  const mapDispatchToProps = (dispatch,ownProps) => {
    return {
      setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
    }
  };
  export default connect(mapStateToProps,mapDispatchToProps)(PendienteACH);