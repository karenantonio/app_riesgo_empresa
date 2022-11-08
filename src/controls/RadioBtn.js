import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {Input,Item,Label,List,ListItem,Text,Right,Body,Icon,Picker,CheckBox as CheckBox2} from 'native-base'
import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';  
import {actionSetValorControl} from '../store/actions'

class RadioBtn extends React.Component {
    state = {
        titulo:"",
        datos:[],
        valor:"",
        data: [{label: 'MININCO', value: '1' },{label: 'EESS', value: '2' }]
    };
  
    componentDidMount() {
        const valores = this.props.valores;

        const valor = JSON.parse(valores.filter(row=>row.Nombre==="seleccionado")[0].Valor)

        this.setState({valor});
    }
  
    render() {
        const configs = this.props.configs;
        let titulo = configs.filter(row=>row.Nombre === "titulo")[0].Valor;

        return (<View>
            <View>
                <Item regular style={{borderColor:"transparent"}}>
                    <Label style={{marginLeft:10,marginTop:10,fontSize:14,color: this.props.baseColor.Valor}}>{titulo.toUpperCase()}</Label>
                </Item>
                <View style={{marginLeft:10, marginTop:10}}>
                    <RadioForm 
                        radio_props={this.state.data} 
                        onPress={(value)=>{
                            this.props.setValorControl(this.props.id,this.props.tipo,"seleccionado",value);
                            this.setState({valor:value});
                        }}
                        selectedButtonColor={'green'}
                    />
                </View>
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
  
export default connect(null,mapDispatchToProps)(RadioBtn);