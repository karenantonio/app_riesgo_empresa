
import React, { Component } from 'react';
import { View, Image, ScrollView, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button as Button2, Body, Text, Label, Item, Input, Spinner, Icon as IconNB, Right, Container, Content, Header, Title, Left } from 'native-base';
import { Icon } from 'react-native-elements'
import prompt from 'react-native-prompt-android';
import { sendPendientes, asyncSendPendientes } from '../../functions/sendDoc'

import Menu from './Menu'
import Button from './Button'


import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested'])

/*
{
  _id,
  Items:{
    _id,
    Titulo,
    Items:{
      _id,
      Titulo,
      Items{},
      FormId,
      Activo,
      Imagen,
      Tipo
    }
  }
}

*/

class index extends React.Component {

  state = {
    selected: null,
    selected2: null,
    items: [],
    loadingSync: false,
    data: [],
    data2: [],
    profile: null
  }

  /* loadFrofile()
  {
    const profile = this.props.profilef(this.props.username);
  
    if(profile === undefined){
      this.setState({profile: 'Not Found'});
    }else{
      this.setState({profile});
    }
  } */

  load() {
    const data = this.props.dataf();
    this.setState({ data });
    const profile = this.props.profilef(this.props.username);
    const permisos = profile.Permisos;

    data.map(item => {
      permisos.map(permiso => {
        if (item.FormId === permiso.FormId) {
          //console.log(item.Titulo);
          this.setState(state => ({
            data2: state.data2.concat([item])
          }));
        }
      })
    })
  }

  /* async componentWillMount() {
    await this.loadFrofile();
  }
 */
  async componentDidMount() {
    await this.load();
  }

  render() {
    if (this.state.selected !== null) {
      const submenus = this.state.data.filter(row => row._id === this.state.selected)[0].Items;

      return (
        <Container>
          <Content>
            <View>
              {
                submenus.map((item, index) => {
                  //DETERMINAR SI AÑADIR UN MENU O UN BOTON:
                  if (item.Items.length === 0) {
                    return (
                      <Button
                        key={index}
                        Title={item.Titulo}
                        onPress={() => { this.props.onPress(item); }}
                        theme={this.props.theme}
                      />
                    );
                  }
                  else {
                    let open = true;
                    if (this.state.selected2 !== item._id) { open = false; }
                    return (
                      <View key={index}>
                        <Menu
                          Open={open}
                          Title={item.Titulo}
                          onPress={() => { this.setState({ selected2: item._id, open: true }) }}
                          theme={this.props.theme}
                        />
                        {
                          this.state.selected2 === item._id &&
                          <View>
                            {
                              item.Items.map((menu2, index2) => {
                                return (
                                  <Button
                                    key={index2}
                                    Title={menu2.Titulo}
                                    onPress={() => { this.props.onPress(menu2); }}
                                    theme={this.props.theme}
                                  />
                                )
                              })
                            }
                          </View>
                        }
                      </View>
                    )
                  }
                })
              }
            </View>
          </Content>{this.props.toolbar}</Container>
      );
    }
    else
      return (
        <Container>
          <Header style={{ backgroundColor: this.props.theme.primary, borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
            <Left style={{ flex: 2 }} />
            <Body style={{ alignContent: "center", alignItems: "center", flex: 6 }}>
              <Title>Riesgo Empresa</Title>
            </Body>
            <Right style={{ flex: 2 }}>
              <Button2 transparent onPress={async () => {
                try { asyncSendPendientes(); } catch (err) { console.log(err) };
                this.setState({ loadingSync: true });
                this.props.refresh(() => {
                  this.setState({ loadingSync: false });
                  this.setState({ data2: [] });
                  this.load();
                });
              }}>
                {
                  this.state.loadingSync ?
                    <Spinner color={"white"} /> :
                    <Icon
                      name={"refresh"}
                      type='font-awesome'
                      color={"white"}
                    />
                }
              </Button2>
            </Right>
          </Header>
          <Content>
            <View style={styles.container}>
              {
                this.state.data2.map(item => {
                  let background = item.Style.BackGroundColorActive;
                  let color = item.Style.ColorActive;
                  let opacity = 1;
                  if (item.Activo === false) {
                    background = item.Style.BackGroundColorDisabled;
                    color = item.Style.ColorDisabled;
                    opacity = 0.6;

                    return (
                      <Button2
                        full
                        iconLeft
                        key={item._id}
                        style={{ ...styles.buton2Style, backgroundColor: background, opacity }}
                        onLongPress={() => {
                          prompt(
                            'Mantenimiento',
                            'Ingrece el código de mantenimiento.',
                            [
                              { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
                              {
                                text: 'OK', onPress: code => {
                                  if (code === '19415108') {
                                    if (item.Items.length === 0) {
                                      this.props.onPress(item);
                                    } else {
                                      this.setState({ selected: item._id });
                                    }
                                  } else {
                                    Alert.alert('Código Erroneo', 'El código ingresado es erroneo.');
                                  }
                                }
                              },
                            ],
                            {
                              type: 'secure-text',
                              cancelable: false,
                              defaultValue: '',
                              placeholder: 'Código'
                            }
                          );
                        }}
                      >
                        <Icon
                          size={30}
                          name={item.IconName}
                          type={item.IconLibrary}
                          color={background}
                          containerStyle={styles.iconStyle}
                        />
                        <Text style={{ ...styles.title, color }}>
                          {item.Titulo}
                        </Text>
                      </Button2>
                    );
                  } else {
                    return (
                      <Button2
                        full
                        iconLeft
                        key={item._id}
                        style={{ ...styles.buton2Style, backgroundColor: background, opacity }}
                        onPress={() => {
                          if (item.Items.length === 0)
                            this.props.onPress(item);
                          else
                            this.setState({ selected: item._id });
                        }}
                      >
                        <Icon
                          size={30}
                          name={item.IconName}
                          type={item.IconLibrary}
                          color={background}
                          containerStyle={styles.iconStyle}
                        />
                        <Text style={{ ...styles.title, color }}>
                          {item.Titulo}
                        </Text>
                      </Button2>
                    );
                  }
                })
              }
            </View>
          </Content>{this.props.toolbar}</Container>
      );
  }
}

/*
<View style={styles.cardHeader}><View style={{alignItems:"center", justifyContent:"center"}}></View></View>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    marginBottom: 40,
    paddingTop: 10
  },
  list: {
    paddingHorizontal: 0,
  },
  listContainer: {
    alignItems: 'center'
  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 10,
    flexBasis: '42%',
    marginHorizontal: 10
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 70,
    width: 70,
    alignSelf: 'center'
  },
  title: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
  },
  /* ****** Button-Menu ****** */
  iconStyle: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 0
  },
  buton2Style: {
    margin: 10,
    height: 60,
    paddingLeft: 10,
    borderRadius: 30
  }
});

export default index;