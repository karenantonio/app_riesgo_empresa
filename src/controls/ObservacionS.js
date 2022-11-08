import React, { Component } from 'react';
import {
  Content,
  Item,
  Label,
  Textarea,
  View
} from 'native-base';
import {Icon} from 'react-native-elements';
import { connect } from 'react-redux';
import { actionSetValorControl } from '../store/actions';
import { StyleSheet } from 'react-native';

class Observacion extends Component {
  state = {
    observacion: '',
    titulo: ''
  }

  onChangeObservacion(value) {
    this.props.setValorControl(
      this.props.id,
      this.props.tipo,
      "texto",
      value
    );

    this.setState({observacion: value});
  }

  componentDidMount() {
    let configs = this.props.configs;
    
    let titulo = configs.filter(row => row.Nombre === 'titulo')[0]?.Valor;

    this.setState({titulo: titulo});
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon name='comment' type='font-awesome' color={this.props.baseColor.Valor} size={50} resizeMode="contain"/>
        <Label style={{fontSize:18}}>{this.state.titulo}</Label>
        <View style={styles.content}>
          <Textarea
            autoCapitalize='characters'
            numberOfLines={1}
            value={this.state.comentario}
            onChangeText={(value)=>{this.onChangeObservacion(value);}} 
            style={[styles.textArea, {borderColor: this.props.baseColor.Valor}]}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingLeft:20,
    paddingRight:20, 
    alignItems: 'center'
  },
  content: {
    flex: 1,
    width: '100%'
  },
  textArea: {
    borderRadius: 20,
    borderWidth: 2,
    height: '100%'
  }
});

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
  }
};

export default connect(null,mapDispatchToProps)(Observacion);