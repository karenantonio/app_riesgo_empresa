import React, { Component } from 'react';
import {ScrollView,View, BackAndroid} from 'react-native';
import {Spinner, Title,Content,Card,CardItem,Container,Thumbnail,List,Input,Item,Header,Tabs, Tab, Icon, TabHeading, ListItem, Text,Left,Right,Body,Button, Grid, Row} from 'native-base';

export default class Trabajador extends Component {

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
                if(evaluacion.FechaEvaluacion !=="")
                {
                  const sp = evaluacion.FechaEvaluacion.split(" ");
                  let sp2 = sp[0].split("-");
                  fecha = sp2[2] + "-" + sp2[1] + "-" + sp2[0];
                  hora  = sp[1];
                }
                
                return(<Card key={key} style={{borderRadius: 20, borderWidth: 1}}>
                    <CardItem cardBody style={{marginTop:10, marginBottom: 10, borderRadius: 20}}>
                      <Body style={{paddingLeft:0, borderRadius: 20}}>
                        <Row>
                          <Text style={{fontSize:18,marginLeft:20}}>Fecha Evaluación:</Text>
                          <Right>
                            <Text style={{fontSize:18,marginRight:20}}>{fecha}</Text>
                          </Right>
                        </Row>
                        <Row>
                          <Text style={{fontSize:18,marginLeft:20}}>Cargo:</Text>
                          <Right>
                            <Text style={{fontSize:18,marginRight:20}}>{evaluacion.Cargo}</Text>
                          </Right>
                        </Row>
                        <Row>
                          <Text style={{fontSize:18,marginLeft:20}}>% Cumplimiento:</Text>
                          <Right>
                            <Text style={{fontSize:18,marginRight:20,color:evaluacion.Color}}>{evaluacion.Porcentaje}%</Text>
                          </Right>
                        </Row>
                      </Body>
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