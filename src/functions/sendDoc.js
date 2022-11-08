import {FD_URL_SEND} from 'react-native-dotenv'
import getRealm from '../realm'
import {sendDocFromDb} from '../functions/index'


//RETORNA TRUE OR FALSE
export const sendDocFromId = async (docId) =>{
    const realm = getRealm(); 
    let documentos = [...realm.objects("Documento")]
    let doc = documentos.filter(row=>row._id.$oid === docId)[0];
    return await sendDoc(doc);
}

export const sendPendientes = () => {
    const realm = getRealm();
    let documentos = [...realm.objects("Documento")];
    let docs = documentos.filter(row => row.Estado === 2);
    console.log(`documentos: ${documentos.length}, filtrados: ${docs.length}`);
    docs.forEach(doc => {
        sendDoc(doc)
            .then(success => {
                if (success) {
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
            })
            .catch(error => {
                console.log(error);
            });
    });
}

export const asyncSendPendientes = async ()=>{
    const realm = getRealm();
    let documentos = [...realm.objects("Documento")];  
    let docs = documentos.filter(row=>row.Estado === 2);
    await docs.map(async doc => {
        const resultado = await sendDoc(doc);
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

export const sendDoc = async (doc) =>
{
    //ELIMINAMOS LA CLAVE DE NOMBRE Y ESTADO, AGREGADOS PARA LOGICA LOCAL
    let newDoc = {...doc};
    delete newDoc._id;
    delete newDoc.Estado;

    //AÑADO FECHAS DE ENVIO:
    const fecha = new Date();
    const fechaOBJ = {$date: fecha.getTime() - (fecha.getTimezoneOffset()*60000)}
    newDoc.FechaEnvio = fechaOBJ;
    newDoc.FechaEnvioUTC = fechaOBJ;

    //ELIMINAMOS JSON ESTRUCTURADO COMO REALM

    newDoc.Pages    = Array.from(newDoc.Pages, item => ({...item}));
    newDoc.Hooks    = Array.from(newDoc.Hooks, item => ({...item}));

    newDoc.Hooks.map(hook => {
        hook.Configs = Array.from(hook.Configs, item => ({...item}));
    });

    newDoc.Tag      = Array.from(newDoc.Tag, item => ({...item}));

    newDoc.Pages.map(pagina => {
        pagina.Controles = Array.from(pagina.Controles, item => ({...item}));
        convertToArray(pagina.Controles);
    });
    console.log(JSON.stringify(newDoc));
    let response = await fetch(FD_URL_SEND, {method: 'POST',
        headers: {Accept: 'application/json','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',},
        body: JSON.stringify(newDoc),
    });

    if(response.status === 200)
    {
        return true;
    }
    else
    {
        return false;
    }
}

const convertToArray = (controles) =>
{
    if(controles.length>0)
    controles.map(control => {
        control.Valores     = Array.from(control.Valores, item => ({...item}));
        control.Configs     = Array.from(control.Configs, item => ({...item}));
        control.Controles   = Array.from(control.Controles, item => ({...item}));
        control.Template    = Array.from(control.Template, item => ({...item}));
        convertToArray(control.Controles);
    });
}