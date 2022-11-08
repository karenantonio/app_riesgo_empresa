import realm from '../realm/index'
import {FD_URL_APIS} from 'react-native-dotenv'
import VersionNumber from 'react-native-version-number'
import NetInfo from "@react-native-community/netinfo";
import {getDeviceInfo,getJsonFromApi} from './common'
import {sendDoc} from './sendDoc'
import {syncCollection} from './syncUp'
import { SERVICE_SYNC_COLLECTIONS,APPLICATION_CODE } from 'react-native-dotenv'
import {Alert} from 'react-native'
import {getValue} from '../realm/functions/common'

const COLLECTIONS_LIST = SERVICE_SYNC_COLLECTIONS.split(",");

//RETORNA TRUE OR FALSE: FROM SERVICE OR NOT
export const sendDocFromDb = async (docId) =>{
    let documentos = [...realm.objects("Documento")]
    let doc = documentos.filter(row=>row._id.$oid === docId)[0];
    return await sendDoc(doc);
}

//SINCRONIZA DATOS CON EL SERVIDOR DE FORMA MANUAL, ESPERANDO A QUE TERMINE LA EJECUCIÓN
export const syncUpWithOutService = async (logFunction) =>{
    const device = getDeviceInfo();
    const user = await getValue("cognito");
    await syncUp(device,user,false,logFunction,false); //OJO, IT IS FORCE TRUE (siempre) or FALSE (por fecha local)
}

//RETORNA TRUE OR FALSE: FROM SERVICE OR NOT
export const syncUp = async (_device,_user,_fromService,_logFunction,_force) =>{
    const params  = {device:_device,user:_user,app:VersionNumber,application:APPLICATION_CODE};  
    await NetInfo.fetch().then(async state => {
        if(state.isConnected)
        {
            _logFunction("INFO","Iniciando proceso de sincronización.");

            //API OF APIS##########################################################
            //console.log(params); //Body de llamada hacia la API

            const requestapi = await getJsonFromApi(FD_URL_APIS, params,_logFunction);
            if(requestapi.message) {
                //ERROR CON API DE APIS
                if(_fromService===false)
                _logFunction("ERROR","No se puede conectar con la API principal.");
                //Alert.alert("Cuidado!","Error con API principal.");
                return;
            }

            //VERIFICAR QUE LAS APIS ESPERADAS SEAN LAS RECIBIDAS
            let todoBien = true;

            for(var i=0;i<requestapi.length;i++) {
                if(COLLECTIONS_LIST.indexOf(requestapi[i].name)===-1)
                {
                    todoBien=false;
                }
            }

            if(todoBien === true && COLLECTIONS_LIST.length === requestapi.length) {
                await Promise.all(requestapi.map(async api => {
                    await syncCollection(api.name, params, _fromService, api.url, _logFunction, _force);
                })).catch(reason => { 
                    console.log("ERROR PROMISE ALLS",reason);
                });
            } else {
                //ERROR: LAS APIS RECIBIDAS NO SON LAS ESPERADAS.
                if(_fromService===false)
                console.log("ERROR", "Inconsistencia entre apis configuradas y apis recibidas.");
                //Alert.alert("Cuidado!","Inconsistencia entre apis configuradas y apis recibidas. Apis esperadas ("+COLLECTIONS_LIST.length+") apis recibidas: ("+requestapi.length+").");
            }
        }
        else
        {
            console.log("WARNING", "No hay internet para proceso de sincronización.");
        }
    });
}