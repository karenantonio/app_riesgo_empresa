import React, {Component} from 'react';
import Index from './src/project';
import {Provider} from 'react-redux';
import {Store} from './src/store';
import getRealm from './src/realm'
import BackgroundJob from "react-native-background-job";
import { Platform, PermissionsAndroid } from 'react-native'
import { 
  SERVICE_FD_SEND_TIMEOUT_IN_MINUTES,
  SERVICE_FD_SEND_PERIOD_IN_MINUTES,
  SERVICE_SYNC_COLLECTION_TIMEOUT_IN_MINUTES,
  SERVICE_SYNC_COLLECTION_PERIOD_IN_MINUTES,
  COGNITO_REGION,
  COGNITO_POOL_ID,
  COGNITO_POOL_WEB_CLIENT_ID } from 'react-native-dotenv'
import Amplify from 'aws-amplify';
import Welcome from './src/components/welcome'
import {getDeviceInfo} from './src/functions/common'
import {sendPendientes} from './src/functions/sendDoc';

//global.swich      = [];
//global.nota       = [];
//global.porcentaje = [];

Amplify.configure({
  Auth: {
      region: COGNITO_REGION,
      userPoolId: COGNITO_POOL_ID,
      userPoolWebClientId: COGNITO_POOL_WEB_CLIENT_ID,
  }
});

//REGISTRO DE SERVICIO: CADA VEZ AL INICIAR APP
if(Platform.OS === 'android'){
  BackgroundJob.register({
    jobKey: 'sendPendingJob',
    job: () => sendPendientes()
  });
}

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert('¡Atención!','No podrá tomar fotos si no otorga permisos.');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default class App extends Component {

  state = {
    loading:true,
    device:null
  }

async componentDidMount()
{
  await requestCameraPermission();
  
    const realm = getRealm();
    if(realm.objects('Property').length===0)
    {
        //INICIALIZACION DE BASE DE DATOS (SOLO LA PRIMERA VEZ) PARA CUALQUIER LAS APP
        await realm.write(() => {
          realm.create('Property',{Key:"remember",Value:"0"});
          realm.create('Property',{Key:"username",Value:""});
          realm.create('Property',{Key:"password",Value:""});
          realm.create('Property',{Key:"cognito",Value:""});      //USER COGNITO
        });

        BackgroundJob.cancelAll();
        BackgroundJob.schedule({
          jobKey: 'sendPendingJob',
          timeout: 1000*60*5,
          period: 1000*60*15
        });
    }

    const device = await getDeviceInfo(); 
    window.setTimeout(()=>{this.setState({loading:false,device});},2300);
  }

  render() {
    return (
      <Provider store={Store}>
          {this.state.loading === true ?  <Welcome/> : <Index device={this.state.device}/>}
      </Provider>);
  }
}
