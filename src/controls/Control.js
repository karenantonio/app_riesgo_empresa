import React, { Component, PureComponent, Suspense } from 'react';
import { View, Text } from 'react-native'

import Acuerdo from './Acuerdo';
import Autocompletar from './Autocompletar';

// Agrupa preguntas por titulos (item)
import Item from './Item';
import ItemV from './ItemV';
// ********************************

// Preguntas + Observaciones
import Check from './Check';
import CheckA from './CheckA';
import CheckM from './CheckM';
import CheckMM from './CheckMM';
import CheckMMH from './CheckMMH-Patrimonio';
// ********************************

// Observaciones 
import Observacion from './Observacion';
import ObservacionM from './ObservacionM';
import ObservacionS from './ObservacionS';
import ObservacionGral from './ObservacionGral';
import ObservacionGralAc from './ObservacionGralAc';
// ********************************

import Advertencia from './Advertencia';
import Texto from './Texto';
import Totalizador from './Totalizador';
import FirmaDigital from './FirmaDigital'
import CodigoQR from './CodigoQR'
import Lista from './Lista'
import Grupo from './Grupo'
import Row from './Row'
import Foto from './Foto'
import Matriz from './Matriz'
import CheckBox from './CheckBox'
import Fecha from './Fecha'
import TotalizadorM from './TotalizadorM';
import AutocompletarText from './AutocompletarText';
import RadioBtn from './RadioBtn';
import Pendiente from './Pendiente';
import PendienteSCH from './PendienteSCH';
import PendienteACH from './PendienteACH';
import GrupoIPS from './GrupoIPS';
import TotalizadorMM from './TotalizadorMM';
import IPS from './IPS';
import OPS from './OPS';
import Automultiple from './Automultiple';
import GrupoOPS from './GrupoOPS';

// Notas
import TotalizadorNota from './TotalizadorNota';
import TotalizadorNotaMonitoreoSSO from './TotalizadorNotaMonitoreoSSO';
import TotalizadorNotaMonitoreoSSOV from './TotalizadorNotaMonitoreoSSOV';
import Totalizador_Patrimonio from './Totalizador-Patrimonio'
// ********************************

import TitleV from './Title-Patrimonio'
import SubTitleV from './SubTitleV-Patrimonio'

class Control extends PureComponent {
  getComponent(_tipo) {
    switch (_tipo) {
      case "Advertencia": return <Advertencia {...this.props} />; break;
      case "Acuerdo": return <Acuerdo {...this.props} />; break;
      case "Autocompletar": return <Autocompletar  {...this.props} />; break;
      case "Check": return <Check  {...this.props} />; break;
      case "CheckA": return <CheckA {...this.props} />; break;
      case "Item": return <Item {...this.props} />; break;
      case "ItemV": return <ItemV {...this.props} />; break;
      case "TitleV": return <TitleV {...this.props} />; break;
      case "SubTitleV": return <SubTitleV {...this.props} />; break;
      case "Texto": return <Texto {...this.props} />; break;
      case "Totalizador": return <Totalizador {...this.props} />; break;
      case "Observacion": return <Observacion {...this.props} />; break;
      case "FirmaDigital": return <FirmaDigital {...this.props} />; break;
      case "CodigoQR": return <CodigoQR {...this.props} />; break;
      case "Lista": return <Lista {...this.props} />; break;
      case "Grupo": return <Grupo {...this.props} />; break;
      case "Row": return <Row {...this.props} />; break;
      case "Foto": return <Foto {...this.props} />; break;
      case "Matriz": return <Matriz {...this.props} />; break;
      case "CheckBox": return <CheckBox {...this.props} />; break;
      case "Fecha": return <Fecha {...this.props} />; break;
      case "CheckM": return <CheckM {...this.props} />; break;
      case "TotalizadorM": return <TotalizadorM {...this.props} />; break;
      case "AutocompletarText": return <AutocompletarText {...this.props} />; break;
      case "ObservacionM": return <ObservacionM {...this.props} />; break;
      case "ObservacionS": return <ObservacionS {...this.props} />; break;
      case "RadioBtn": return <RadioBtn {...this.props} />; break;
      case "Pendiente": return <Pendiente {...this.props} />; break;
      case "PendienteSCH": return <PendienteSCH {...this.props} />; break;
      case "PendienteACH": return <PendienteACH {...this.props} />; break;
      case "GrupoIPS": return <GrupoIPS {...this.props} />; break;
      case "CheckMM": return <CheckMM {...this.props} />; break;
      case "CheckMMH": return <CheckMMH {...this.props} />; break;
      case "TotalizadorMM": return <TotalizadorMM {...this.props} />; break;
      case "IPS": return <IPS {...this.props} />; break;
      case "OPS": return <OPS {...this.props} />; break;
      case "Automultiple": return <Automultiple {...this.props} />; break;
      case "GrupoOPS": return <GrupoOPS {...this.props} />; break;
      case "ObservacionGral": return <ObservacionGral {...this.props} />; break;
      case "ObservacionGralAc": return <ObservacionGralAc {...this.props} />; break;
      case "TotalizadorNota": return <TotalizadorNota {...this.props} />; break;
      case "TotalizadorNotaMonitoreoSSO": return <TotalizadorNotaMonitoreoSSO {...this.props} />; break;
      case "TotalizadorNotaMonitoreoSSOV": return <TotalizadorNotaMonitoreoSSOV {...this.props} />; break;
      case "Totalizador_Patrimonio": return <Totalizador_Patrimonio {...this.props}/>; break
    }
  }
  render() {
    return (
      <View>{this.getComponent(this.props.tipo)}</View>);
  }
}

export default Control;