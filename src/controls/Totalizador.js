import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Text,Body, Col, Grid} from 'native-base'
import {View,Alert, PanResponder} from 'react-native'
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'

let update = null;

class Totalizador extends Component {


  render() {
    let rangos  = JSON.parse(this.props.configs.filter(row=>row.Nombre === "rangos")[0].Valor);

    let n_check  = this.props.configs.filter(row=>row.Nombre === "resultado")[0].Valor;

    let valores     = this.props.valores.filter((row)=>((row.tipo === "Check") && row.clave === "presionado"));
    let porcentaje = '0';
    let nota_calculada = '0';

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
      //console.log("VALORES FILTRADOS POR TAG",valores);
    }

    //console.log("VALORES",valores);

    //HACER CONTEO MULTIPLICANDO POR LA PONDERACION


    //OJO AQUI... ES NECESARIO QUE LOS CONTROLES CHECK TENGAN UN CODIGO "si" O "na" (SE PUEDE MEJORAR EN EL FUTURO PARA CODIGOS DINAMICOS)
    let si = valores.filter(row=>row.valor==="si");
    let na = valores.filter(row=>row.valor==="na");

    si = si.reduce(function(total, current) { return total + parseInt(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor); }, 0);
    na = na.reduce(function(total, current) { return total + parseInt(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor); }, 0);

    //TOTAL DE PONDERACION SACANDO LOS NO APLICA
    const poderacion_SoloNa = valores.filter(row=>row.valor==="na").reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor)); }, 0);
    //TOTAL DE PONDERACION DE SOLO SI(solo funciona en check doble)
    const poderacion_SoloSi = valores.filter(row=>row.valor==="si").reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor)); }, 0);
    const poderacion_SoloNo = valores.filter(row=>row.valor==="no").reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor)); }, 0);;
    const poderacion_Suma = valores.reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor)); }, 0);;

    /* console.log('si',poderacion_SoloSi);
    console.log('no',poderacion_SoloNo);
    console.log('na',poderacion_SoloNa); */
    //console.log((poderacion_SoloSi/(poderacion_Suma-poderacion_SoloNa))*100);
    //console.log("ponderacion solo na",(poderacion_SoloNa)*100/rangos[(rangos.length-1)].notaSuperior);
    //console.log("TOTAL SOLO SI", poderacion_SoloSi);
    /* let poderacion_Positiva = poderacion_SoloSi+poderacion_SoloNa;
    console.log(poderacion_Positiva/(poderacion_Suma.toFixed(2))*100); */

    let p_base = rangos[0].notaInferior;
    let n_max = (rangos[(rangos.length-1)].notaSuperior)-rangos[0].notaInferior;
    let cumplimientoCheck = 0;
    /* let cumplimiento_SoloNa = (poderacion_SoloNa*100)/rangos[(rangos.length-1)].notaSuperior;
    let cumplimiento_SoloSI = (poderacion_SoloSi*100)/rangos[(rangos.length-1)].notaSuperior; */

    if(poderacion_SoloNa === poderacion_Suma){
      nota_calculada = "N A"
      porcentaje = "N A"
    }else {
      if(poderacion_SoloSi === 0){
       nota_calculada = 1.0;
       nota_calculada = nota_calculada.toFixed(2);
      } else {
        if(n_check === 'nota-induccion'){
          cumplimientoCheck = ((poderacion_SoloSi+poderacion_SoloNa)/poderacion_Suma.toFixed(2))*100;
          porcentaje = Math.trunc(cumplimientoCheck);
          nota_calculada = (porcentaje*((n_max+p_base)/100));
          nota_calculada = nota_calculada.toFixed(2);
        } else {
          //crear if de -0!!!!
          cumplimientoCheck = (poderacion_SoloSi/(poderacion_Suma.toFixed(2)-poderacion_SoloNa))*100;
          porcentaje = Math.trunc(cumplimientoCheck);
          //console.log('nota nueva',(porcentaje*(n_max/100))+p_base);
          //nota_calculada = poderacion_SoloSi+poderacion_SoloNa;
          nota_calculada = (porcentaje*(n_max/100))+p_base;
          nota_calculada = nota_calculada.toFixed(2);
        }
      }
    }
    //console.log((poderacion_SoloNa)*100/rangos[(rangos.length-1)].notaSuperior);
    //console.log(cumplimientoCheck,"%");
    nota_calculada = nota_calculada.toString().replace(".",",").substr(0,3);
    porcentaje = porcentaje;

    //ANALIZAR MASCARA:
    let mascara = this.props.configs.filter(row=>row.Nombre === "mascara")[0].Valor;
    mascara = mascara.replace("$CUMPLIMIENTO", porcentaje);
    mascara = mascara.replace("$NOTA", nota_calculada);

    //global.nota = nota_calculada;
    //global.porcentaje = porcentaje;
   /*  global.nota       = global.nota.map(row=>{if(row.id===this.props.id){return {id:row.id,value:nota_calculada}} else return row;});
    global.porcentaje = global.porcentaje.map(row=>{if(row.id===this.props.id){return {id:row.id,value:porcentaje}} else return row;});
 */

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
//#31EB0C verde aprobado
//#EBDD0C amarillo riesgo
//#EB130C rojo critico
{/* <View> 
      <View>
        <Item regular style={{borderWidth:0,borderRadius:10,padding:10,margin:10,backgroundColor:this.props.theme.commonOkColor}}>
            <Body style={{justifyContent: "center"}}>
              <Text style={{fontSize:28,color:"#ffffff"}}>{mascara}</Text>
            </Body>
        </Item>
     </View>
     {this.props.renderizar(this.props)}</View> */}

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
export default connect(mapStateToProps,mapDispatchToProps)(Totalizador);