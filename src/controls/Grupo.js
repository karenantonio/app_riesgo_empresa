import React, { Component, PureComponent } from 'react';
import { Input as Input2, Item as Item2, Label, Text, ListItem, Left, Body, Right, List, Button } from 'native-base'
import { View, Alert, Modal, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { validarCheck } from '../functions/common';
import { actionUpdateDoc } from '../store/actions'

class Grupo extends Component {

  render() {
    const configs = this.props.configs;
    const readOnly = this.props.self.props.readOnly;
    //console.log(readOnly);
    //const template  = this.props.template;
    let titulo = configs.filter(row => row.Nombre === "titulo")[0].Valor;
    return (
      <View pointerEvents={readOnly ? 'none' : 'auto'}>
        <View style={{ marginTop: 10 }}>
          <ListItem itemDivider style={{ marginTop: '5%', backgroundColor: 'transparent', justifyContent: 'center' }}>
            <Icon name='plus' type='font-awesome' color={this.props.baseColor.Valor} size={80}
              onPress={() => {
                this.props.addRowtoGroup(this.props.id);
                //AQUI ALTERAR EL DOCUMENTO ACTUAL AGREGANDO UN ROW DENTRO DE LOS CONTROLES DE ESTE GRUPO
                /*const validation  = validarCheck(this.props.valores);                      
                if(validation.valid === false)
                {
                  Alert.alert("¡Atención!",validation.message);
                }else{
                  this.props.addRowtoGroup(this.props.id);
                }*/

                return;
                const id = (new Date()).getTime();
                const data = [...this.state.data, { id }];
                this.setState({ data, modal: true });
              }} />
          </ListItem>
        </View>
        {this.props.renderizar(this.props)}</View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actionSetNewRow: (id) => { dispatch(actionSetValorControl(id)); },
    updateDoc: (docId) => { dispatch(actionUpdateDoc(docId)); }
  }
};

export default connect(null, mapDispatchToProps)(Grupo);

