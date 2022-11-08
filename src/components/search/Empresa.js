import React, { Component } from 'react';
import {ScrollView,View, BackAndroid} from 'react-native';
import {Spinner, Title,Content,Card,CardItem,Container,Thumbnail,List,Input,Item,Header,Tabs, Tab, Icon, TabHeading, ListItem, Text,Left,Right,Body,Button, Grid, Row} from 'native-base';

import Pie from './Pie'

export default class Empresa extends Component {

  state = {
      loading:true,
      evaluaciones:null,
      backButton: null
  }

  componentDidMount()
  {
    window.setTimeout(()=>{
      this.setState({loading:false,evaluaciones:this.props.data});
    },100)
  }

  render() {

    //console.log(JSON.stringify(this.state.evaluaciones));

    if(this.state.loading)
    {
      return(<Spinner color={this.props.theme.primary}/>);
    }
    else
    {
      const {evaluaciones} = this.state;
      return (
        <Container>
        <Header style={{backgroundColor:this.props.theme.primary, borderBottomEndRadius: 20, borderBottomStartRadius: 20}}>
          <Left style={{flex:1}}>
            <Button transparent onPress={()=>{this.props.onBack();}}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body style={{flex:5}}>
            <Title>{evaluaciones[0].Nombre}</Title>
          </Body>
        </Header>
        <Content>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{paddingLeft:10,paddingRight:10,paddingTop:10,marginBottom:20}}>
              {evaluaciones.map((evaluacion,key)=>{
                let fecha = "";
                let hora = "";
                if(evaluacion.Fecha !=="")
                {
                  const sp = evaluacion.Fecha.split(" ");
                  let sp2 = sp[0].split("-");
                  fecha = sp2[2] + "-" + sp2[1] + "-" + sp2[0];
                  hora  = sp[1];
                }

                //console.log("INCUMPLIMIENTOS",evaluacion.Incumplimientos);
                
                return(<Card key={key} style={{borderRadius: 20, borderWidth: 1}}>
                    <CardItem cardBody style={{marginTop:10, borderRadius: 20}}>
                      <Body style={{paddingLeft:0, borderRadius: 20}}>
                        <Row>
                          <Text style={{fontSize:18,marginLeft:20}}>Nota: {evaluacion.Nota}</Text>
                          <Right>
                            <Text note style={{marginRight: '7%'}}>{fecha}</Text>
                          </Right>
                        </Row>
                        <List>
                        {evaluacion.Incumplimientos.length>0 ? evaluacion.Incumplimientos.map((incumplimiento,key)=>{

                          return(<View style={{borderWidth:1,borderColor:"#cbcbcb",borderRadius:20,margin:10,padding:10}} key={key}>
                            <Text style={{fontSize:12}}>{incumplimiento.Enunciado}</Text>
                            {incumplimiento.Documento!=="" &&<Text style={{fontSize:12}}>{incumplimiento.Documento}</Text>}
                          </View>);
                        })
                        :
                          <ListItem style={{borderWidth: 1, borderRadius: 20, padding: 10}}>
                            <Text style={{fontSize:12}}>Sin Incumplimientos</Text>
                          </ListItem>
                        }
                        </List>
                      </Body>
                    </CardItem>
                    <CardItem style={{borderRadius: 20}}>
                      <Body>
                      </Body>
                      <Right>
                        <Text style={{height: 7}}></Text>
                      </Right>
                    </CardItem>

                    
                  </Card>)
                })
              }
            </ScrollView>
        </Content>
        </Container>
      );
    }
  }
}

/*
<ListItem>
                            <Text style={{fontSize:12}}>Sin Incumplimientos</Text>
                          </ListItem>
                          */