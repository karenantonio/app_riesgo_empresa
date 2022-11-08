import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Textarea,Content,DatePicker} from 'native-base'
import {View, Alert} from 'react-native'
import {actionSetValorControl} from '../store/actions'
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';

class Fecha extends React.Component {

  state = {
    fecha:""
  }

  JStoMongo = (newDate) =>{
    const fecha = newDate.getFullYear().toString() + "-" + this.isLow10((newDate.getMonth()+1)) + "-" +  this.isLow10(newDate.getDate()) + "T00:00:00.000Z";
    return fecha;
  }
  mongotoJS = (fecha) =>
  {
    let sp1 = fecha.split("T");
    let sp2 = sp1[0].split("-");
    return {
        date:new Date(parseInt(sp2[0]),parseInt(sp2[1])-1,parseInt(sp2[2])),
        fecha:sp2[2] + "-" + sp2[1] + "-" + sp2[0],
        agno:sp2[0],
        mes:sp2[1]
    };
  }
  isLow10(_number)
  {
    if(_number <10)
    return "0" + _number.toString();
    else
    return _number.toString();
  }

  componentWillMount()
  {
    let fecha  = JSON.parse(this.props.valores.filter(row=>row.Nombre==="fechamongo")[0].Valor)
    if(fecha!=="" && fecha !=='""')
    {
        //TRASFORMAR A JS PORQUE SIEMPRE VIENE DESDE DB COMO MONGO FORMAT
        fecha = this.mongotoJS(fecha).date;
    }
    this.setState({fecha});
  }

  render() {
    const configs = this.props.configs;
    let titulo = configs.filter(row=>row.Nombre === "titulo")[0].Valor;
    let texto  = "___ /___ /___";

    if(this.state.fecha!=="")
    {
        //FORMATEAR JS:
        texto = this.mongotoJS(this.JStoMongo(this.state.fecha)).fecha;
    }
    return (<View> 
      <View>
        <Item regular style={{borderColor:"transparent"}}>
          <Grid>
          <Row>
              <Label style={{marginLeft:10,marginTop:10,fontSize:14,color: this.props.baseColor.Valor}}>{titulo.toUpperCase()}</Label>
          </Row>
          <Row style={{justifyContent: 'center'}}>
              <View style={{borderColor: this.props.baseColor.Valor, borderTopWidth: 2, borderBottomWidth: 2, borderRightWidth: 2, borderStartWidth: 2, borderRadius: 20}}>
              <DatePicker
                    date={this.state.fecha}
                    defaultDate={this.state.fecha}
                    minimumDate={new Date(2000, 1, 1)}
                    maximumDate={new Date(2050, 12, 31)}
                    locale={"es"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    textStyle={{ color: this.props.baseColor.Valor }}
                    placeHolderText={texto}
                    placeHolderTextStyle={{ color: this.props.baseColor.Valor }}
                    onDateChange={(date)=>{
                        this.props.setValorControl(this.props.id,this.props.tipo,"fechamongo",date);
                        this.setState({fecha:date});
              }}
              disabled={false}/>
              </View>
          </Row>
          </Grid>
        </Item>
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

export default connect(null,mapDispatchToProps)(Fecha);