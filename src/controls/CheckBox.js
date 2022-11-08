import React, { Component,PureComponent } from 'react';
import {Input,Item,Label,List,ListItem,Text,Right,Body,Icon,Picker,CheckBox as CheckBox2} from 'native-base'
import {View,Alert,Modal,TouchableOpacity,ScrollView,FlatList} from 'react-native'
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'

class CheckBox extends Component {
    state = {
        data:[],
        titulo:"",
        valor:[], 
    };

    /*un array de valores*/
  
    componentDidMount() {
        const configs = this.props.configs;
        const valores = this.props.valores;
        
        let titulo          = configs.filter(row=>row.Nombre === "titulo")[0].Valor;
        let valor           = [];
        let data            = [];

        if(valores.filter(row=>row.Nombre==="checkeados")[0].Valor !== '""')
        {
            valor = JSON.parse(valores.filter(row=>row.Nombre==="checkeados")[0].Valor)
        }

        //ANALIZAR SI EXISTE CONFIGURACION DE "DATOS" (SOLO DATOS ESTATICOS PARA EL CONTROL CHECKBOX POR AHORA)
        if(configs.filter(row=>row.Nombre === "datos").length>0)
        {
            data  = JSON.parse(configs.filter(row=>row.Nombre === "datos")[0].Valor);
        }
        this.setState({titulo,valor,data});
    }
  
    render() {
        return (<View>
            <View>
                <Item regular style={{borderColor:"transparent"}}>
                    <Label style={{marginLeft:10,marginTop:20,fontSize:14}}>{this.state.titulo}</Label>
                </Item>
                <View>
                    {this.state.data.map((item,ii)=>{
                        let checked = false;
                        //DETERMINAR SI ESTA CHECKEADO O NO DEPENDIENDO DEL VALOR y EL ARRAY DE VALORES:
                        let valores = this.state.valor;
                        let valor   = item.Valor;
                        if(valores.indexOf(valor) !== -1)
                        {
                            checked = true;
                        }
                        return (<ListItem key={ii}><CheckBox2 checked={checked} onPress={()=>{
                            //OBTENER EL VALOR ACTUAL (EL CONTRARIO AL ACTUAL)
                            let nuevos_valores =  [];

                            //ANALIZAR SI SACAR O AGREGAR AL VALOR GLOBAL DE ARRAY
                            if(valores.indexOf(item.Valor) !== -1)
                            {
                                //SACAR
                                nuevos_valores = valores.filter(row=>row!==item.Valor);
                            }
                            else
                            {
                                //AGREGAR
                                nuevos_valores = [...valores,item.Valor];
                            }
                            //GUARDAR EL VALOR GLOBAL:
                            this.props.setValorControl(this.props.id,this.props.tipo,"checkeados",nuevos_valores);
                            this.setState({valor:nuevos_valores});


                        }}/><Body><Text>{item.Nombre}</Text></Body></ListItem>);
                    })
                    }
                </View>
            </View>
            {this.props.renderizar(this.props)}</View>
        );
    }
}

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
      setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
    }
};
  
export default connect(null,mapDispatchToProps)(CheckBox);