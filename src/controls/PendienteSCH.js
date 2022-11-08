import React, {Component} from 'react';
import {Input,Item,Label,Textarea,Content,Text, Body} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {View} from 'react-native';
import {actionSetValorControl} from '../store/actions'
import { connect } from 'react-redux';
import { map } from 'core-js/fn/array';

class PendienteSCH extends Component{

    state = {
        data_sso: [],
        data_com: [],
        data_acc: [],
        data_reu: [],
        filter: null
    };

    componentDidMount() {
        const configs = this.props.configs;

        let data_sso = [];
        let data_com = [];
        let data_acc = [];
        let data_reu = [];
        let filter = {};
    
        //Tomar data de los pendientes
        let nombre_lista_reu = configs.filter(row => row.Nombre === 'lista_reu')[0].Valor; // Acta de Reuniones
        let nombre_lista_sso = configs.filter(row => row.Nombre === 'lista_sso')[0].Valor; // Observaciones SSO
        let nombre_lista_com = configs.filter(row => row.Nombre === 'lista_com')[0].Valor; // Compromisos SSO
        let nombre_lista_acc = configs.filter(row => row.Nombre === 'lista_acc')[0].Valor; // Análisis de Accidentes

        let lista_reu = this.props.listas.filter(row => row.Codigo === nombre_lista_reu); // Acta de Reuniones
        let lista_sso = this.props.listas.filter(row => row.Codigo === nombre_lista_sso); // Observaciones SSO
        let lista_com = this.props.listas.filter(row => row.Codigo === nombre_lista_com); // Compromisos SSO
        let lista_acc = this.props.listas.filter(row => row.Codigo === nombre_lista_acc); // Análisis de Accidentes

        if (lista_sso.length > 0) {
            data_sso = lista_sso[0].Items;
        }
        if (lista_com.length > 0) {
            data_com = lista_com[0].Items;
        }
        if (lista_acc.length > 0) {
            data_acc = lista_acc[0].Items;
        }
        if (lista_reu.length > 0) {
            data_reu = lista_reu[0].Items;
        }

        //Filtro por empresa
        if (configs.filter(row => row.Nombre === 'filter').length > 0) {
          filter = JSON.parse(
            configs.filter(row => row.Nombre === 'filter')[0].Valor,
          );
        }
    
        this.setState({data_sso, data_com, data_reu, data_acc, filter});
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

        let {data_sso} = this.state;
        let {data_com} = this.state;
        let {data_acc} = this.state;
        let {data_reu} = this.state;

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
                    data_sso = data_sso.filter(
                    row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
                    );
                }
                if (remoteValue.length == 1) {
                    data_com = data_com.filter(
                    row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
                );
                }
                if (remoteValue.length == 1) {
                    data_acc = data_acc.filter(
                    row => row[this.state.filter.thisKey] === fetchFromObject(remoteValue[0], this.state.filter.fromKey)
                );
                }
                if (remoteValue.length == 1) {
                    data_reu = data_reu.filter(
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
                        <Text style={{fontSize:16,color: this.props.theme.primary, fontWeight: 'bold'}}>{'PENDIENTES MONITOREO SCH'}</Text>
                    </Row>    
                </Grid>
                {data_sso.length > 0 ? 
                    <View>
                        {data_sso.map((item, i) => 
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

                <Grid>
                    <Row style={{justifyContent:'center', marginTop:10}}>
                        <Text style={{fontSize:16,color: this.props.theme.primary, fontWeight: 'bold'}}>{'PENDIENTES COMPROMISOS SCH'}</Text>
                    </Row>    
                </Grid>    
                {data_com.length > 0 ? 
                    <View>
                        {data_com.map((item, i) => 
                            <Item key={i} regular style={{borderWidth:10,borderRadius:20,padding:10,margin:10,backgroundColor: 'transparent', borderColor:'black'}}>                       
                                <Grid>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{'Fecha de Plazo: '+item.Texto3}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{'Acuerdo: '+item.Texto2}</Text>
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

                <Grid>
                    <Row style={{justifyContent:'center', marginTop:10}}>
                        <Text style={{fontSize:16,color: this.props.theme.primary, fontWeight: 'bold'}}>{'PENDIENTES ACR'}</Text>
                    </Row>    
                </Grid>
                {data_acc.length > 0 ? 
                    <View>
                        {data_acc.map((item, i) => 
                            <Item key={i} regular style={{borderWidth:10,borderRadius:20,padding:10,margin:10,backgroundColor: 'transparent', borderColor:'black'}}>                       
                                <Grid>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{'Fecha de Plazo: '+item.Texto3}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{item.Texto2}</Text>
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

                <Grid>
                    <Row style={{justifyContent:'center', marginTop:10}}>
                        <Text style={{fontSize:16,color: this.props.theme.primary, fontWeight: 'bold'}}>{'PENDIENTES ACTA DE REUNIÓN'}</Text>
                    </Row>    
                </Grid>
                {data_reu.length > 0 ? 
                    <View>
                        {data_reu.map((item, i) => 
                            <Item key={i} regular style={{borderWidth:10,borderRadius:20,padding:10,margin:10,backgroundColor: 'transparent', borderColor:'black'}}>                       
                                <Grid>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{'Fecha de Plazo: '+item.Texto3}</Text>
                                    </Row>
                                    <Row>
                                        <Text style={{fontSize:14,color: this.props.theme.primary}}>{item.Texto2}</Text>
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
  export default connect(mapStateToProps,mapDispatchToProps)(PendienteSCH);