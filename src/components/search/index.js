import React, { Component } from 'react';
import {ScrollView,View} from 'react-native';
import {Spinner,Label, Footer,FooterTab,Content,Card,CardItem,Container,Thumbnail,List,Input,Item,Header,Tabs, Tab, Icon, TabHeading, ListItem, Text,Left,Right,Body,Button} from 'native-base';
import Empresa from './Empresa';
import Trabajador from './Trabajador';

class index extends Component {

  state = {
    buscar: "",
    empresa: null,
    empresas: [],
    dataE: [],
    trabajador: null,
    trabajadores: [],
    dataT: []
  }

  componentDidMount()
  {
    this.props.setBackButton(() => {this.props.go("Menu");});

    const dataE = this.props.empresasf();
    const dataT = this.props.trabajadoresf();

    let empresasData = dataE.map(row=>{return {Nombre: row.Nombre, Rut: row.Rut};});
    let empresasUnique = [... new Set(empresasData.map(data => data.Nombre))]; 
    let empresas = [];

    empresasUnique.forEach(empresa => {
      empresas.push(empresasData.filter(row => row.Nombre === empresa)[0]);
    });

    let trabajadoresData = dataT.map(row=>{return {Nombre: row.Nombre, Rut: row.Rut};});
    let trabajadoresUnique = [... new Set(trabajadoresData.map(data => data.Nombre))];
    let trabajadores = [];

    trabajadoresUnique.forEach(trabajador => {
      trabajadores.push(trabajadoresData.filter(row => row.Nombre === trabajador)[0]);
    });

    this.setState({empresas,dataE,trabajadores,dataT});
  }

  render() {
    if (this.state.empresa)
    {
      return (
        <Empresa theme={this.props.theme} onBack={()=>{this.setState({empresa:null});}} data={this.state.dataE.filter(row=>row.Nombre===this.state.empresa.Nombre)}/>
      );
    }
    else if (this.state.trabajador)
    {
      return (
        <Trabajador theme={this.props.theme} onBack={()=>{this.setState({trabajador:null});}} data={this.state.dataT.filter(row=>row.Nombre===this.state.trabajador.Nombre)}/>
      );
    }
    else {
      let empresas = this.state.empresas.filter(empresa => {
        let searchValue = this.state.buscar.toLowerCase();

        if (searchValue === "")
          return false;
        if (empresa.Nombre.toLowerCase().includes(searchValue))
          return true;
        if (empresa.Rut.toLowerCase().includes(searchValue))
          return true;

        return false;
      });
      let trabajadores = this.state.trabajadores.filter(trabajador => {
        let searchValue = this.state.buscar.toLowerCase();

        if (searchValue === "")
          return false;
        if (trabajador.Nombre.toLowerCase().includes(searchValue))
          return true;
        if (trabajador.Rut.toLowerCase().includes(searchValue))
          return true;

        return false;
      });

      const ListaEmpresas =
        <List>
          {empresas.map((item, index) => {
            return (
              <ListItem noIndent key={`e:${index}`} onPress={()=>{this.setState({empresa:item});}}>
                <Body>
                  <Text>{item.Nombre}</Text>
                  <Text note numberOfLines={1}>{item.Rut}</Text>
                </Body>
              </ListItem>
            );
          })}
        </List>

      const ListaTrabajadores =
        <List>
          {trabajadores.map((item, index) => {
            return (
              <ListItem noIndent key={`t:${index}`} onPress={()=>{this.setState({trabajador:item});}}>
                <Body>
                  <Text>{item.Nombre}</Text>
                  <Text note numberOfLines={1}>{item.Rut}</Text>
                </Body>
              </ListItem>
            );
          })}
        </List>

      return (
        <Container>
          <Header hasTabs searchBar rounded style={{backgroundColor:this.props.theme.primary, borderBottomEndRadius: 20, borderBottomStartRadius: 20, borderBottomWidth: 0.1}}>
            <Item style={{backgroundColor: this.props.theme.primary}}>
              <Icon type="FontAwesome" name="search" style={{color:"white"}}/>
              <Input placeholder="Buscar" placeholderTextColor={"white"} value={this.state.buscar} onChangeText={(value)=>{this.setState({buscar:value});}} style={{color:"white"}}/>
              <Icon type="FontAwesome" name="times" onPress={()=>{this.setState({buscar:""});}} style={{color:"white"}}/>
            </Item>
          </Header>
          <Tabs tabBarUnderlineStyle={{backgroundColor:"transparent"}}>
            <Tab heading="Empresas"
              tabStyle={{backgroundColor: this.props.theme.primary}} activeTabStyle={{backgroundColor: this.props.theme.primary}}
              textStyle={{color: 'grey'}} activeTextStyle={{color: 'white'}}>
              <Content>
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                  {ListaEmpresas}
                </ScrollView>
              </Content>
            </Tab>
            <Tab heading="Trabajadores"
              tabStyle={{backgroundColor: this.props.theme.primary}} activeTabStyle={{backgroundColor: this.props.theme.primary}}
              textStyle={{color: 'grey'}} activeTextStyle={{color: 'white'}}>
              <Content>
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                  {ListaTrabajadores}
                </ScrollView>
              </Content>
            </Tab>
          </Tabs>
          {this.props.toolbar}
        </Container>
      );
    }
  }
}

export default index;