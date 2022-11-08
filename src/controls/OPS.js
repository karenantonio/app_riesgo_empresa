import React, {Component} from 'react';
import {Input,Item,Label,Textarea,Content,Text, Body} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {View} from 'react-native';
import {actionSetValorControl} from '../store/actions'
import { connect } from 'react-redux';
import { map } from 'core-js/fn/array';

class OPS extends Component{

    state = {
        data_ips: [],
        filter: null
    };

    componentDidMount() {
        const configs = this.props.configs;

        let data_con, data_lgf = [];
        let filter = {};
    
        //Tomar data de IPS
        /*let nombre_lista_ips = configs.filter(row => row.Nombre === 'lista_ips')[0].Valor; 
        let lista_ips = this.props.listas.filter(row => row.Codigo === nombre_lista_ips); 


        if (lista_ips.length > 0) {
            data_ips = lista_ips[0].Items;
        }

        //Filtro por empresa
        if (configs.filter(row => row.Nombre === 'filter').length > 0) {
          filter = JSON.parse(
            configs.filter(row => row.Nombre === 'filter')[0].Valor,
          );
        }*/
    
        this.setState({data_con, data_lgf, filter});
    }

    render(){
        //console.log(data_ips);
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

        let {data_con, data_lgf} = this.state;

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
               /* if (remoteValue.length == 1) {
                    data_ips = data_ips.filter(
                    row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
                    );
                }*/

            } catch (error) {
                console.log(error);
            }
        }

        return( 
            <View>        
                {/*data_ips.length > 0 ? */}
                    <View>
                        {/*data_sso.map((item, i) => */}
                            <Item regular style={{borderRadius:15,padding:10,margin:10,backgroundColor: '#e3e2e1'}}>                       
                                <Grid>
                                    <Row>
                                        <Text style={{fontSize:17,color: 'black', fontWeight: 'bold'}}>{'Conducta'}</Text>
                                        <Text style={{fontSize:17,color: 'black', fontWeight: 'bold', marginLeft:'65%'}}>{'2/10'}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize:14,color:'black', marginTop:'1%'}}>
                                            {'PENDIENTES MONITOREO SSO PENDIENTES MONITOREO SSO PENDIENTES MONITOREO SSO PENDIENTES MONITOREO SSO PENDIENTES MONITOREO SSO PENDIENTES MONITOREO SSO'}
                                        </Text>
                                    </Row>                                    
                                </Grid>
                            </Item>                     
                    </View>
                {/*
                    <Item regular style={{borderWidth:10,borderRadius:20,padding:10,margin:10,backgroundColor: 'transparent', borderColor:'black'}}>                       
                        <Grid>
                            <Row style={{justifyContent:'center'}}>
                                <Text style={{fontSize:14,color: this.props.theme.primary}}>{'No hay incumplimientos pendientes.'}</Text>
                            </Row>
                        </Grid>
                    </Item>
                */}
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
  export default connect(mapStateToProps,mapDispatchToProps)(OPS);