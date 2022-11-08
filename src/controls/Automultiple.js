import React, { Component } from 'react';
import { View } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Input, Item, Label, Textarea, Content, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { actionSetValorControl } from '../store/actions'
import { connect } from 'react-redux';
import { map } from 'core-js/fn/array';

const items = [
  {
    id: '1',
    name: '211'
  },
  {
    id: '2',
    name: '212'
  },
  {
    id: '3',
    name: '213'
  },
  {
    id: '4',
    name: '214'
  },
  {
    id: '5',
    name: '215'
  },
  {
    id: '6',
    name: '219'
  },
  {
    id: '7',
    name: '311'
  },
  {
    id: '8',
    name: '312'
  },
  {
    id: '9',
    name: '313'
  },
  {
    id: '10',
    name: '314'
  },
  {
    id: '11',
    name: '315'
  },
  {
    id: '12',
    name: '316'
  },
  {
    id: '13',
    name: '318'
  },
  {
    id: '14',
    name: '319'
  },
  {
    id: '15',
    name: '411'
  },
  {
    id: '16',
    name: '412'
  },
  {
    id: '17',
    name: '413'
  },
  {
    id: '18',
    name: '414'
  },
  {
    id: '19',
    name: '415'
  },
  {
    id: '20',
    name: '416'
  },
  {
    id: '21',
    name: '417'
  },
  {
    id: '22',
    name: '419'
  },
  {
    id: '23',
    name: '511'
  },
  {
    id: '24',
    name: '512'
  },
  {
    id: '25',
    name: '513'
  },
  {
    id: '26',
    name: '514'
  },
  {
    id: '27',
    name: '515'
  },
  {
    id: '28',
    name: '516'
  },
  {
    id: '29',
    name: '517'
  },
  {
    id: '30',
    name: '518'
  },
  {
    id: '31',
    name: '519'
  },
  {
    id: '32',
    name: '611'
  },
  {
    id: '33',
    name: '612'
  },
  {
    id: '34',
    name: '613'
  },
  {
    id: '35',
    name: '614'
  },
  {
    id: '36',
    name: '615'
  },
  {
    id: '37',
    name: '616'
  },
  {
    id: '38',
    name: '617'
  },
  {
    id: '39',
    name: '618'
  },
  {
    id: '40',
    name: '619'
  },
  {
    id: '41',
    name: '711'
  },
  {
    id: '42',
    name: '712'
  },
  {
    id: '43',
    name: '713'
  },
  {
    id: '44',
    name: '714'
  },
  {
    id: '45',
    name: '811'
  },
  {
    id: '46',
    name: '812'
  },
  {
    id: '47',
    name: '3111'
  },
  {
    id: '48',
    name: '3112'
  },
  {
    id: '49',
    name: '5112'
  },
  {
    id: '50',
    name: '6110'
  },
  {
    id: '51',
    name: '212B'
  },
  {
    id: '52',
    name: '3.1.10'
  },
  {
    id: '53',
    name: '312B'
  },
  {
    id: '54',
    name: '314B'
  },
  {
    id: '55',
    name: '318B'
  },
  {
    id: '56',
    name: '412B'
  },
  {
    id: '57',
    name: '512B'
  },
  {
    id: '58',
    name: '612B'
  },
  {
    id: '59',
    name: '612C'
  },
  {
    id: '60',
    name: 'AGROFOR 11'
  },
  {
    id: '61',
    name: 'AGROFOR 12'
  },
  {
    id: '62',
    name: 'AGROFOR 13'
  },
  {
    id: '63',
    name: 'CERDA 26'
  },
  {
    id: '64',
    name: 'CERDA 84'
  },
  {
    id: '65',
    name: 'CUMBRES 13'
  },
  {
    id: '66',
    name: 'CUMBRES 14'
  },
  {
    id: '67',
    name: 'CUMBRES 16'
  },
  {
    id: '68',
    name: 'INDEF 10'
  },
  {
    id: '69',
    name: 'INDEF 11'
  },
  {
    id: '70',
    name: 'INDEF 12'
  },
  {
    id: '71',
    name: 'INDEF 15'
  },
  {
    id: '72',
    name: 'SAFCO 11'
  },
  {
    id: '73',
    name: 'SAFCO 15'
  },
  {
    id: '74',
    name: 'SERFONAC 21'
  },
  {
    id: '75',
    name: 'SERFONAC 22'
  },
  {
    id: '76',
    name: 'SERFONAC 41'
  },
  {
    id: '77',
    name: 'SERFONAC 42'
  },
  {
    id: '78',
    name: 'SERFONAC 43'
  },
  {
    id: '79',
    name: 'SERFONAC 44'
  },
  {
    id: '80',
    name: 'SERFONAC 46'
  },
  {
    id: '81',
    name: 'SERFONAC 48'
  },
  {
    id: '82',
    name: 'SERFONAC 54'
  },
  {
    id: '83',
    name: 'SERFONAC 74'
  },
  {
    id: '84',
    name: 'SERFONAC 75'
  }
];

class Automultiple extends Component {

  state = {
    titulo: "",
    selectedItems: []
  };

  componentDidMount() {
    const configs = this.props.configs;
    const valores = this.props.valores;

    let titulo = configs.filter(row => row.Nombre === 'titulo')[0].Valor;
    this.setState({ titulo });
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.props.setValorControl(this.props.id, this.props.tipo, "seleccionado", selectedItems)
  };

  render() {
    const { selectedItems } = this.state;
    return (
      <View style={{ flex: 1, marginLeft: 5 }}>
        <Label
          style={{
            marginLeft: 5,
            marginTop: 15,
            marginBottom: 11,
            fontSize: 14,
            color: this.props.baseColor.Valor,
          }}>
          {this.state.titulo.toUpperCase()}
        </Label>
        <MultiSelect
          hideTags
          items={items}
          uniqueKey="name"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Seleccione..."
          searchInputPlaceholderText="Buscar..."
          // onChangeInput={(x) =>, console.log(x)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor={this.props.baseColor.Valor}
          submitButtonText="Aceptar"
          tagContainerStyle={{ width: '100%' }}
          styleTextTag={{ textAlign: 'left', color: 'black' }}

        />
        <View>
          {selectedItems.length !== 0 ?
            this.multiSelect.getSelectedItemsExt(selectedItems)
            //selectedItems.map((item, i) => console.log(item.substring(0,40)))
            :
            console.log("Vacío")
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    //listas: state.reducerListas,
    globalValues: state.reducerValores,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => {
      dispatch(actionSetValorControl(_id, _tipo, _clave, _valor));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Automultiple);