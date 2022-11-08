import React, { Component, PureComponent } from 'react';
import { Input as Input2, Item as Item2, Label, Text, ListItem } from 'native-base'
import { View } from 'react-native'

class Item extends PureComponent {
  render() {
    const configs = this.props.configs;
    const order = this.props.orden;
    let titulo = configs.filter(row => row.Nombre === "titulo")[0].Valor;
    return (
      <View>
        <View>
          <ListItem itemDivider style={{ marginTop: 10, borderRadius: 10, backgroundColor: "white", marginRight: 5, marginLeft: 0, justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: this.props.baseColor.Valor, textAlign: 'center' }}>{order}. {titulo}</Text>
          </ListItem>
        </View>
        {this.props.renderizar(this.props)}
      </View>
    );
  }
}

{/* <View> 
      <View>
        <ListItem itemDivider style={{marginTop:10,borderRadius:10,backgroundColor:"#ececec",marginRight:5,marginLeft:0}}>
              <Text style={{fontSize:14}}>{titulo}</Text>
        </ListItem> 
     </View>
     {this.props.renderizar(this.props)}</View> */}
export default Item;