import {sendDocFromDb} from '../functions'
import realm from '../realm'
import {syncUp} from '../functions/index'
import {getDeviceInfo} from '../functions/common'
import {getValue} from '../realm/functions/common'

//ENVIA DOCUMENTOS PENDIENTES
export const sendPending = async ()=>{
    const documentos = [...realm.objects("Documento")];  
    let docs = documentos.filter(row=>row.Estado === 2);
    await docs.map(async doc => {
        const resultado = await sendDocFromDb(doc);
        if(resultado === true)
        {
            //ACTUALIZA ESTADO Y FECHAS:
            realm.write(() => {
                var obj = realm.objects('Documento').filtered('_id.$oid = "' + doc._id.$oid + '"');
                if (obj.length === 1) 
                {
                    const fechaOBJ = {$date:new Date().getTime()};
                    obj[0].Estado = 3;   
                    obj[0].FechaEnvio = fechaOBJ;
                    obj[0].FechaEnvioUTC = fechaOBJ;
                }  
            });
        }
    });
}

//SINCRONIZA DATOS CON EL SERVIDOR
export const syncUpFromService = async () =>{
    const device = getDeviceInfo();
    const user = await getValue("cognito");
    syncUp(device,user,true,false);
}