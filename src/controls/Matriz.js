import React, { Component,PureComponent } from 'react';
import {Input,Item,Label,List,ListItem,Text,Right,Body,Icon,Picker} from 'native-base'
import {View,Alert,Modal,TouchableOpacity,ScrollView,FlatList} from 'react-native'
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'

class Matriz extends Component {
    state = {
        titulo:"",
        matriz:null,
        valores:[],
        resultado:null
    };


    obtenerResultadoDesdeValores(valores,rangos)
    {
        //CALCULAR VALOR DE LA COMBINACION:
        let valueCom = 0;
        for(var i=0;i<valores.length;i++)
        {
            if(valores[i].operacion === "suma")
            {
                valueCom += parseInt(valores[i].valor);
            }
            if(valores[i].operacion === "resta")
            {
                valueCom -= parseInt(valores[i].valor);
            }
        }
        //ENCASILLAMIENTO EN UN RANGO:
        let resultado = {texto:"(indefinido)",valor:0}
        for(var i=0;i<rangos.length;i++)
        {
            if(valueCom >= parseInt(rangos[i].desde) && valueCom <= parseInt(rangos[i].hasta))
            {
                resultado = {texto:rangos[i].resultado,valor:valueCom}
            }
        }    
        return resultado;
    }

  
    componentDidMount() {
        const configs = this.props.configs;
        const valores = this.props.valores;
        
        let titulo          = configs.filter(row=>row.Nombre === "titulo")[0].Valor;
        let valor1          = valores.filter(row=>row.Nombre==="seleccion")[0].Valor;
        let valor2          = valores.filter(row=>row.Nombre==="resultado")[0].Valor;
        let matriz          = JSON.parse(configs.filter(row=>row.Nombre === "matriz")[0].Valor);
        let resultado       = {texto:"(indefinido)",valor:0};
        let losvalores      = [];

        if(valor1 !== '""')
        {
            losvalores = JSON.parse(valor1);
        }
        if(valor2 !== '""')
        {
            resultado = JSON.parse(valor2);
        }

        //Alert.alert("",JSON.stringify(matriz));
        this.setState({titulo,matriz,valores:losvalores,resultado});
    }
  
    render() {
        return (<View>
            <View>
            <Item regular style={{borderColor:"transparent"}}>
                <Label style={{marginLeft:10,marginTop:20,fontSize:14}}>{this.state.titulo}</Label>
            </Item>
            {
                        this.state.matriz !== null && this.state.matriz.dimensiones.map((item,i)=>{
                            return (
                                <Item regular style={{borderColor:"transparent"}} key={i}>
                                    <Label style={{marginLeft:10,marginTop:20,fontSize:14}}>{item.titulo}</Label>
                                    <Picker
                                    note
                                    mode="dropdown"
                                    style={{marginLeft:10,marginTop:20}}
                                    selectedValue={(this.state.valores.filter(row=>row.titulo===item.titulo).length>0) ? this.state.valores.filter(row=>row.titulo===item.titulo)[0].valor : ""}
                                    onValueChange={(valor)=>{
                                        let {valores} = this.state;
                                        if(valores.filter(row=>row.titulo===item.titulo).length>0)
                                        {
                                            valores.filter(row=>row.titulo===item.titulo)[0].valor = valor;
                                        }
                                        else
                                        {
                                            valores.push({titulo:item.titulo,valor,operacion:item.operacion});
                                        }
                                        //Alert.alert("",JSON.stringify(valores));
                                        
                                        const resultado = this.obtenerResultadoDesdeValores(valores,this.state.matriz.rangos);
                                        
                                        //GRABAR EL VALOR GLOBAL DEL CONTROL:
                                        this.props.setValorControl(this.props.id,this.props.tipo,"seleccion",valores);
                                        this.props.setValorControl(this.props.id,this.props.tipo,"resultado",resultado);

                                        this.setState({valores,resultado});
                                    }}
                                    >
                                    <Picker.Item label={" --- seleccione ---"} value={""} />
                                    {
                                        item.valores.map((valor,i)=>{
                                            return (<Picker.Item label={valor.texto} key={i} value={valor.valor} />)
                                        })
                                    }
                                    </Picker>
                                </Item>
                            )
                        })
                    }

            <View style={{borderRadius:8,backgroundColor:this.props.theme.commonOkColor,padding:20,marginTop:20}}>
                    <Text style={{color:"#FFFFFF"}}>{this.state.resultado !== null ? this.state.resultado.texto + " (" + this.state.resultado.valor + ")" : "---"}</Text>
            </View>
            </View>
            {this.props.renderizar(this.props)}</View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        //listas:state.reducerListas,
    }
};
  
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
      setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
    }
};
  
export default connect(mapStateToProps,mapDispatchToProps)(Matriz);