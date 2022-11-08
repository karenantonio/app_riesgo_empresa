import React, { Component } from 'react';
import { View,Alert,Modal, ActivityIndicator,ScrollView} from 'react-native';
import {Spinner, Container,Thumbnail,List,Input,Item,Header,Tabs, Tab, Icon, TabHeading, ListItem, Text,Left,Right,Body,Button} from 'native-base';

/*
documents:[{_id,Titulo:"1234",Tipo:"un tipo",Estado:1,Fecha,Hora}]
draftPress
draftLongPress
outboxPress
outboxLongPress
sentPress
theme
documents
toolbar
*/
 
class index extends Component {

  state = {
    buscar:"",
    documentos:[],
    enviando:false,
    tab:"borrador"
  }

  loadDocuments()
  {
    const documentos = this.props.documentosf();
    this.setState({documentos});
  }

  componentDidMount()
  {
    this.props.setBackButton(() => {this.props.go("Menu");});
    this.loadDocuments();
  }

  getFechaHora(FechaCreacion)
  {
    var d = new Date(FechaCreacion);
    var fecha = d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear();
    var hora = d.getHours()+":"+d.getMinutes();
    return {fecha,hora,dia:d.getDate(),mes:(d.getMonth()+1)};
  }

  getMonthFromNumber(_number)
  {
    switch (_number) {
      case 1:return "Ene";break;
      case 2:return "Feb";break;
      case 3:return "Mar";break;
      case 4:return "Abr";break;
      case 5:return "May";break;
      case 6:return "Jun";break;
      case 7:return "Jul";break;
      case 8:return "Ago";break;
      case 9:return "Sep";break;
      case 10:return "Oct";break;
      case 11:return "Nov";break;
      case 12:return "Dic";break;
    }
  }


  getValueFromControlId(_doc,_id)
  {
    for(var i=0;i<_doc.Pages.length;i++)
    {
        let busqueda = this.getValueFromControlIdAux(_doc.Pages[i],_id,_doc.Pages[i].Orden);
        if(busqueda !== ""){return busqueda;}  
    }return "";
  }

  getValueFromControlIdAux(parent,coordenada,level)
  {
    let resultado = "";
    for(var i=0;i<parent.Controles.length;i++)
    {
      let control = parent.Controles[i];
      let ctlLevel = level + '.' + control.Orden;
        if(coordenada === ctlLevel)
        {
            if(control.Tipo === "Lista")
            {
              try {
                  //devolver el nombre -> se asume que son listas cons datos en duro. faltaria incorporar funcion para listas que funcionen sin datos en duro
                  let listado = JSON.parse(control.Configs.filter(row=>row.Nombre === "datos")[0].Valor);
                  let valor   = JSON.parse(control.Valores.filter(row=>row.Nombre==="seleccionado")[0].Valor);
                  if(valor !== "")
                  {
                    resultado = listado.filter(row=>row.Valor == valor)[0].Nombre;  //JSON.parse(listado)
                    try{resultado = resultado.toUpperCase()}catch(e){}
                  }
                  else{
                    resultado = "";
                  }
              } catch (error) {
                
              }
            }
            if(control.Tipo === "Autocompletar")
            {
                resultado = JSON.parse(control.Valores.filter(row=>row.Nombre==="seleccionado")[0].Valor).Texto1;
                try{resultado = resultado.toUpperCase()}catch(e){}
            }
            if(control.Tipo === "Totalizador")
            {
              //console.log("valores",control.Valores,control);
              resultado = JSON.parse(control.Valores.filter(row=>row.Nombre==="nota")[0].Valor);
              //resultado = "5.0";
            }
            return resultado;
        }
        resultado = this.getValueFromControlIdAux(control,coordenada,ctlLevel);
        if(resultado !== ""){return resultado;}
    }
    return resultado;
  }

  getCommonValuesFromDoc(doc)
  {
    let color   = "blue";
    let titulo1 = "";
    let titulo2 = "";
    let resultado = "";

    if(doc.Tag.length>0)
    {
      //LEER COLOR SI ES QUE VIENE
      if(doc.Tag.filter(row=>row.Nombre==="color").length>0)
      {
        color = doc.Tag.filter(row=>row.Nombre==="color")[0].Valor;
      }
      if(doc.Tag.filter(row=>row.Nombre==="titulo1").length>0)
      {
        let idTitulo1 = doc.Tag.filter(row=>row.Nombre==="titulo1")[0].Valor;
        titulo1 = this.getValueFromControlId(doc,idTitulo1);
      }
      if(doc.Tag.filter(row=>row.Nombre==="titulo2").length>0)
      {
        let idTitulo2 = doc.Tag.filter(row=>row.Nombre==="titulo2")[0].Valor;
        titulo2 = this.getValueFromControlId(doc,idTitulo2);
      }
      if(doc.Tag.filter(row=>row.Nombre==="resultado").length>0)
      {
        let idResultado = doc.Tag.filter(row=>row.Nombre==="resultado")[0].Valor;
        resultado = this.getValueFromControlId(doc,idResultado);
      }
    }
    return {
      color,titulo1,titulo2,resultado
    }
  }

  render() {

    buscar = this.state.buscar.toLowerCase();

    const documentos = this.state.documentos.filter((row)=>{
      const texto = row.Title + row.Tipo;
      if(texto.toLowerCase().indexOf(buscar) !== -1)
      {
        return row;
      }
    });

    //Alert.alert("",JSON.stringify(documentos));

    const colorActive   = "#ffffff";
    const colorDisabled = "grey";

    return (
      <Container>
      
      <Header hasTabs searchBar style={{backgroundColor:this.props.theme.primary,borderBottomWidth:0}}>
          <Item style={{backgroundColor:this.props.theme.primary,padding:0,margin:0,borderRadius:20}}>
            <Icon type="FontAwesome" name="search" style={{color:"white"}}/>
            <Input placeholderTextColor={"white"} placeholder="Buscar" onChangeText={(valor)=>{this.setState({buscar:valor});}} value={this.state.buscar} style={{color:"white"}}/>
            <Icon type="FontAwesome" name="times" onPress={()=>{this.setState({buscar:""});}} style={{color:"white"}}/>
          </Item>
          
      </Header>

        <Tabs 
        tabBarUnderlineStyle={{backgroundColor:"transparent"}}
        tabBarActiveTextColor="green"
        tabBarInactiveTextColor="green"
        tabBarTextStyle={{color:"red"}}
        onChangeTab={(tab)=>{
           switch(tab.i)
           {
              case 0:this.setState({tab:"borrador"});break;
              case 1:this.setState({tab:"salida"});break;
              case 2:this.setState({tab:"enviados"});break;
           }
        }}
        >

          <Tab heading={
            <View style={{backgroundColor:this.props.theme.primary,height:54,justifyContent:"flex-start"}}>
              <View style={{borderRightWidth:0,borderRightColor:this.props.theme.primary,margin:0,backgroundColor:"white"}}>
                <TabHeading style={{backgroundColor:this.props.theme.primary,borderBottomLeftRadius:20,paddingLeft:20}}>
                  <Icon type="FontAwesome" name="envelope-open" style={{color:this.state.tab==="borrador"?colorActive:colorDisabled}}/>
                  <Text style={{color:this.state.tab==="borrador"?colorActive:colorDisabled}}>Borrador</Text>
                </TabHeading>
              </View>
            </View>
            }
          >

              <View style={{paddingLeft:10,paddingRight:10}}>
              <ScrollView>
              <List style={{marginTop:5}}>
                {documentos.filter(row=>row.Estado===1).map(doc => {
                  const fechahora = this.getFechaHora(doc.FechaCreacion);
                  const common = this.getCommonValuesFromDoc(doc);
                  const values = doc.Pages.map(pag => pag.Controles.map(con => con.Valores).flat().map(val=> JSON.parse(val.Valor)).flat().filter(v => v !== '').flat()).flat().length
                  return(
                    values > 0 &&
                    <ListItem style={{paddingLeft:0,paddingTop:0,height:90}} noIndent thumbnail key={doc._id} onPress={()=>{this.props.draftPress(doc,false);}} onLongPress={()=>{
                      this.props.draftLongPress(doc._id,()=>this.loadDocuments());
                      }}>
                        <Left>
                          <View style={{backgroundColor:common.color,width:65,padding:10,borderRadius:15}}>
                            <Text style={{color:"#ffffff",fontSize:16}}>{fechahora.dia}</Text>
                            <Text style={{color:"#ffffff",fontSize:16}}>{this.getMonthFromNumber(fechahora.mes)}</Text>
                          </View>
                        </Left>
                        <Body style={{borderBottomWidth:0}}>
                          <Text style={{fontSize:14}}>{doc.Title}</Text>
                          <Text note style={{fontSize:12}}>{common.titulo1}</Text>
                          <Text note style={{fontSize:12}}>{common.titulo2}</Text>
                        </Body>
                        <Right style={{borderBottomWidth:0}}>
                          {/* {<Text note>R:{common.resultado}</Text>} */}
                        </Right>
                    </ListItem>
                  )
                })
                }
              </List>
              </ScrollView>
              </View> 
          </Tab>



          <Tab heading={ 
              <TabHeading style={{backgroundColor:this.props.theme.primary,height:54}}>
                <Icon type="FontAwesome" name="envelope" style={{color:this.state.tab==="salida"?colorActive:colorDisabled}}/>
                <Text style={{color:this.state.tab==="salida"?colorActive:colorDisabled}}>Salida</Text>
              </TabHeading>}>
                <View style={{paddingLeft:10,paddingRight:10}}>
              <ScrollView>         
              <List>
                {documentos.filter(row=>row.Estado===2).map(doc => {
                  const fechahora = this.getFechaHora(doc.FechaCreacion);
                  const common    = this.getCommonValuesFromDoc(doc);
                  return(                     
                      <ListItem style={{paddingLeft:0,paddingTop:0,height:90}} noIndent thumbnail key={doc._id} onPress={()=>{/*this.props.outboxPress(doc,true);*/}} onLongPress={()=>{this.props.outboxLongPress(doc._id,()=>this.loadDocuments());}}>
                        <Left>
                            <View style={{backgroundColor:common.color,width:65,padding:10,borderRadius:15}}>
                              <Text style={{color:"#ffffff",fontSize:16}}>{fechahora.dia}</Text>
                              <Text style={{color:"#ffffff",fontSize:16}}>{this.getMonthFromNumber(fechahora.mes)}</Text>
                            </View>
                          </Left>
                          <Body style={{borderBottomWidth:0}}>
                            <Text style={{fontSize:14}}>{doc.Title}</Text>
                            <Text note style={{fontSize:12}}>{common.titulo1}</Text>
                            <Text note style={{fontSize:12}}>{common.titulo2}</Text>
                          </Body>
                          <Right style={{borderBottomWidth:0}}>
                            <Text note>{fechahora.hora}</Text>
                          </Right>
                      </ListItem>
                  )
                })
                }
              </List>
              </ScrollView>
              </View> 
          </Tab>

          <Tab heading={ 
              <View style={{backgroundColor:this.props.theme.primary,height:54,justifyContent:"flex-end"}}>
                <View style={{borderRightWidth:0,borderRightColor:this.props.theme.primary,backgroundColor:"white"}}>
                  <TabHeading style={{backgroundColor:this.props.theme.primary,borderBottomRightRadius:20,paddingRight:20}}>
                    <Icon type="FontAwesome" name="share-square" style={{color:this.state.tab==="enviados"?colorActive:colorDisabled}}/>
                    <Text style={{color:this.state.tab==="enviados"?colorActive:colorDisabled}}>Enviados</Text>
                  </TabHeading>
                </View>
              </View>
              }>
              <View style={{paddingLeft:10,paddingRight:10}}>
              <ScrollView>
                <List>
                {documentos.filter(row=>row.Estado===3).map(doc => {
                  const fechahora = this.getFechaHora(doc.FechaEnvio);
                  const common    = this.getCommonValuesFromDoc(doc);
                  return(
                    <ListItem style={{paddingLeft:0,paddingTop:0,height:90}} noIndent thumbnail key={doc._id} onPress={()=>{this.props.sentPress(doc,true);}}>
                        <Left>
                          <View style={{backgroundColor:common.color,width:65,padding:10,borderRadius:15}}>
                            <Text style={{color:"#ffffff",fontSize:16}}>{fechahora.dia}</Text>
                            <Text style={{color:"#ffffff",fontSize:16}}>{this.getMonthFromNumber(fechahora.mes)}</Text>
                          </View>
                        </Left>
                        <Body style={{borderBottomWidth:0}}>
                          <Text style={{fontSize:14}}>{doc.Title}</Text>
                          <Text note style={{fontSize:12}}>{common.titulo1}</Text>
                          <Text note style={{fontSize:12}}>{common.titulo2}</Text>
                        </Body>
                        <Right style={{borderBottomWidth:0}}>
                          <Text note>{common.resultado}</Text>
                          <Text note>{fechahora.hora}</Text>
                        </Right>
                    </ListItem>
                  )
                })
                }
                </List>
                </ScrollView>
              </View> 
          </Tab>



          
        </Tabs>
        {this.props.toolbar}
      </Container>
    );
  }
}
export default index;