import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Text,Body, Col, Grid} from 'native-base'
import {View,Alert, PanResponder} from 'react-native'
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'

let update = null;

class TotalizadorNotaMonitoreoSSO extends Component {

  render() {
    let rangos     = JSON.parse(this.props.configs.filter(row=>row.Nombre === "rangos")[0].Valor);
    let valores    = this.props.valores.filter((row)=>((row.tipo === "CheckMM") && row.clave === "presionado"));

    //FILTRAR VALORES POR TAG CORRESPONDIENTE SI ES QUE APLICA
    if(this.props.configs.filter(row=>row.Nombre === "tag").length>0)
    {
      let tag = this.props.configs.filter(row=>row.Nombre === "tag")[0].Valor;
      valores = valores.filter(row=>{
          if(row.configs.filter(row=>row.Nombre==="tag").length>0)
          {
            return row.configs.filter(row=>row.Nombre==="tag")[0].Valor == tag
          }
          else
          {
            return false;
          }
      });
    }

    const poderacion_SoloSi = valores.filter(row=>row.valor==="si").reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor)*4); }, 0);

    let nota_calculada;
    let porcentaje = 0;
    let mascara = this.props.configs.filter(row=>row.Nombre === "mascara")[0].Valor;


    if(poderacion_SoloSi === 0){

      nota_calculada = "1.0";

    }else{
      
      nota_calculada = (((poderacion_SoloSi)/100)+1).toFixed(2);
      
    }

    porcentaje     = poderacion_SoloSi/4;
    nota_calculada = nota_calculada.toString().replace(".",",").substr(0,3);

   
    mascara = mascara.replace("$CUMPLIMIENTO", porcentaje);
    mascara = mascara.replace("$NOTA", nota_calculada);


    if(update!==JSON.stringify(this.props.valores))
    {
        this.props.setValorControl(this.props.id,this.props.tipo,"nota",nota_calculada);
        this.props.setValorControl(this.props.id,this.props.tipo,"ponderacion",porcentaje);
        update = JSON.stringify(this.props.valores);
    }

    return (<View> 
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <Item regular style={{borderWidth: 0, borderRadius: 20, padding: 10, margin: 10, backgroundColor:'transparent'}}>
          <Text style={{fontSize:40,color: this.props.theme.primary, textAlign: 'center'}}>{mascara}</Text>
        </Item>
      </View>
     {this.props.renderizar(this.props)}</View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      valores:state.reducerValores,
  }
};
const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(TotalizadorNotaMonitoreoSSO);