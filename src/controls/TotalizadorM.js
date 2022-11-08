import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Text,Body, Col, Grid} from 'native-base'
import {View,Alert, PanResponder} from 'react-native'
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'

let update = null;

class TotalizadorM extends Component {

  /*
  componentWillMount()
  {
    global.swich.push({id:this.props.id,value:-1});
    global.nota.push({id:this.props.id,value:""});
    global.porcentaje.push({id:this.props.id,value:""});
  }
  */


  //DESPUES DE ACTUALIZAR EL COMPONENTE
/*   componentDidUpdate()
  {
    if(update!==JSON.stringify(this.props.valores))
    {
      this.props.setValorControl(this.props.id,this.props.tipo,"nota",global.nota.filter(row=>row.id===this.props.id)[0].value);
      this.props.setValorControl(this.props.id,this.props.tipo,"ponderacion",global.porcentaje.filter(row=>row.id===this.props.id)[0].value);
      update = JSON.stringify(this.props.valores);
    }
    return;
  } */

  render() {
    let rangos  = JSON.parse(this.props.configs.filter(row=>row.Nombre === "rangos")[0].Valor);

    let valores     = this.props.valores.filter((row)=>((row.tipo === "CheckM") && row.clave === "presionado"));
    let porcentaje    = '0';

    /* let valoresCheck = this.props.valores.filter((row)=>((row.tipo === "Check") && row.clave === "presionado"));
    let valoresCheckM = this.props.valores.filter((row)=>((row.tipo === "CheckM") && row.clave === "presionado")); */
    /* console.log("total de check:", valoresCheck[0]);
    console.log("total de checkm:", valoresCheckM[0]); */

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
    const nota_max = valores.reduce(function(total, current) { return total + parseInt(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor); }, -1);
    //const nota_min = valores.reduce(function(total, current) { return total + parseInt(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor); }, 0);
  
    //TOTAL DE PONDERACION DE SOLO SI(solo funciona en check doble)
    const poderacion_SoloSi = valores.filter(row=>row.valor==="si").reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor).toFixed(2)); }, 0);
    const poderacion_Suma = valores.reduce(function(total, current) { return total + +(parseFloat(current.configs.filter(row=>row.Nombre==="ponderacion")[0].Valor)); }, 0);;

    //console.log("SI",si);
    //console.log("NA",na);
    //console.log("TOTAL SIN NA",poderacion_total);
    //console.log("TOTAL SOLO SI", poderacion_SoloSi);

    let p_base = rangos[0].notaInferior;
    let n_max = (rangos[(rangos.length-1)].notaSuperior)-rangos[0].notaInferior;
    let nota_calculada;
    let cumplimientoCheck = 0;

    cumplimientoCheck = (poderacion_SoloSi/poderacion_Suma.toFixed(2))*100;

    porcentaje = Math.trunc(cumplimientoCheck);

    if(poderacion_SoloSi === 0){
      nota_calculada = 1.0;
    }else {
      nota_calculada = (porcentaje*(n_max/100)+p_base);
    }
    
    nota_calculada = nota_calculada.toFixed(2);
    nota_calculada = nota_calculada.toString().replace(".",",").substr(0,3);

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
export default connect(mapStateToProps,mapDispatchToProps)(TotalizadorM);