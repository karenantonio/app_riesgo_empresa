import {readItemsFromCollection} from '../realm/functions/common'
import {selectorDocumentos,selectorDocumento} from './selectors'
import CONSTANTES from './consts'
import getRealm from '../realm'
import { Alert } from 'react-native';


//LEE DE LA BASE DE DATOS Y ENVIA AL STORE LOS DOCUMENTOS
export const actionReadDocs = ()=> {
    return function (dispatch) {
        const flatJsonObject = selectorDocumentos(readItemsFromCollection("Documento")); //PLAN OBJECT
        dispatch({type: CONSTANTES.SET_DOCUMENTOS,value:flatJsonObject})
}};

export const actionSetLog = (log) => ({
    type: CONSTANTES.SET_LOG,log
});

export const actionAddLog = (title,log) => ({
    type: CONSTANTES.ADD_LOG,title,log
});

export const actionSetMenu = (menu) => ({
    type: CONSTANTES.SET_MENU,menu
});

export const actionSetPerfil = (perfil) => ({
    type: CONSTANTES.SET_PERFIL,perfil
});


//VALORES DE UN DOCUMENTO ACTUALMENTE CARGADO
export const actionSetValorControl = (id,tipo,clave,valor)=> {
    return function (dispatch,getState) {
        dispatch({type: CONSTANTES.SET_VALOR_CONTROL,id,tipo,clave,valor});
    }
};

export const actionSetCheckDefaultValues = (value) => ({
    type: CONSTANTES.SET_CHECK_DEFAULT_VALUES,
    value
});

export const actionSetCheckActivo = (value) => ({
    type: CONSTANTES.SET_CHECK_ACTIVO,
    value
});

export const actionInsertValorControl = (id,tipo,clave,valor,configs) => ({
    type: CONSTANTES.INSERT_VALOR_CONTROL,
    id,tipo,clave,valor,configs
});
export const actionClearValorControl = () => ({
    type: CONSTANTES.CLEAR_VALOR_CONTROL,
});

export const actionUpdateDocumento = (_id,_doc) => ({
    type: CONSTANTES.UPDATE_DOCUMENTO,_id,_doc
});

export const actionSetNewRow = (value) => ({
    type: CONSTANTES.SET_NEW_ROW,value
});

export const actionSendDocumento = (id,fechaOBJ,estado,gps) => ({
    type: CONSTANTES.SEND_DOCUMENTO,id,fechaOBJ,estado,gps
});

export const actionAddDocumento = (doc) => ({
    type: CONSTANTES.ADD_DOCUMENTO,doc
});

export const actionSetDocumentos = (value) => ({
    type: CONSTANTES.SET_DOCUMENTOS,value
});

//IMPACTA VALORES EN BASE DE DATOS Y LUEGO AGREGA ROW A DOC
export const actionAddRowToDoc = (idgrupo,iddoc,newId)=> {
    return function (dispatch,getState) {
        const valores = getState().reducerValores;
        const realm = getRealm();
        let obj = realm.objects('Documento').filtered('_id.$oid = "' + iddoc + '"');
        if (obj.length === 1) 
        {
            realm.write(() => 
            {
                //AGREGA ROW EN DOCUMENTO
                obj[0].Pages.forEach(pagina => {
                    addRowtoGroup(pagina,pagina.Orden,idgrupo,realm,newId);
                });

                //GUARDA VALORES ACTUALES EN LA BASE DE DATOS
                obj[0].Pages.forEach(pagina => {
                    guardarProccess(pagina,pagina.Orden,valores)
                });
            });

            //INDICAR ROW NUEVA:
            dispatch(actionSetNewRow(newId.toString()));

            const doc = selectorDocumento(obj[0]);

            //ACTUALIZA DOCUMENTO PLANO EN STORE:
            dispatch(actionUpdateDocumento(iddoc,doc)); 
        }
    }
}

//IMPACTA VALORES EN BASE DE DATOS Y LUEGO AGREGA ROW A DOC
export const actionDelRowToDoc = (idgrupo,iddoc)=> {
    return function (dispatch,getState) {
        const valores = getState().reducerValores;
        const realm = getRealm();

        let obj = realm.objects('Documento').filtered('_id.$oid = "' + iddoc + '"');
        if (obj.length === 1) 
        {
            realm.write(() => 
            {
                //ELIMINA ROW EN DOCUMENTO
                obj[0].Pages.forEach(pagina => {
                    delRowtoGroup(pagina,pagina.Orden,idgrupo,realm);
                }); 

                //GUARDA VALORES ACTUALES EN LA BASE DE DATOS
                obj[0].Pages.forEach(pagina => {
                    guardarProccess(pagina,pagina.Orden,valores)
                });
            });

            const doc = selectorDocumento(obj[0]);

            //ACTUALIZA DOCUMENTO PLANO EN STORE:
            dispatch(actionUpdateDocumento(iddoc,doc)); 
        }
    }
}

//MARCA UN DOC DE LA BASE DE DATOS COMO ENVIADO Y ACTUALIZA STORE DE DOCS (2enviado-pendiente,3enviado)
export const actionSendDoc = (docId,fechaOBJ,estado,gps)=> {
    return function (dispatch) {
        const realm = getRealm();
            realm.write(() => {
                const obj = realm.objects('Documento').filtered('_id.$oid = "' + docId + '"');
                if (obj.length === 1) 
                {
                    obj[0].Estado = estado;   
                    obj[0].FechaEnvio = fechaOBJ;
                    obj[0].FechaEnvioUTC = fechaOBJ;
                    if(gps !== null)
                    {
                        obj[0].Geolocalizacion = {
                            X: gps.coords.latitude,
                            Y: gps.coords.longitude,
                            Z: gps.coords.altitude,
                            Tipo: gps.Tipo,
                            Precision: gps.coords.accuracy
                        };
                    }
                    dispatch(actionSendDocumento(docId,fechaOBJ,estado,gps))
                }
            });
    }
}

//ACTUALIZA TODOS LOS VALORES DEL DOCUMENTO ACTUAL A LA BASE DE DATOS
export const actionUpdateDoc = (docId)=> {
    return function (dispatch,getState) {
        const valores = getState().reducerValores;
        const realm = getRealm();
        realm.write(() => 
        {
            let obj = realm.objects('Documento').filtered('_id.$oid = "' + docId + '"');
            if (obj.length === 1) 
            {
                //RECORRER LAS PÁGINAS ACTUALIZANDO VALORES
                obj[0].Pages.forEach(pagina => {
                    guardarProccess(pagina,pagina.Orden,valores)
                });

                //(PARA CUANDO SE PRESIONE BOTON GUARDAR EN NUEVO CONTROL ROW)
                dispatch(actionSetNewRow(""));

                //ASEGURAR DEVOLVER OBJETO PLANO:
                const d = selectorDocumento(obj[0]);

                dispatch(actionUpdateDocumento(docId,d));
            } 
        });
    }
}

export const guardarProccess = (parent,level,valores) =>{
    try
    {
        parent.Controles.map(child => {
            let ctlLevel = level + '.' + child.Orden;
            //POR CADA UNO DE LOS ITEM DEL ARRAY DE VALORES -> ACTUALIZAR VALORES
            for(var i=0;i<child.Valores.length;i++)
            {
                const id = ctlLevel + child.Tipo + child.Valores[i].Nombre;
                const itemValor = valores.filter(row=>row.id===id);
                if(itemValor.length === 1)
                {
                    //ENCONTRADO. SIEMPRE SE GUARDAN COMO STRING
                    child.Valores[i].Valor = JSON.stringify(itemValor[0].valor);
                    //if(id === "1.1Autocompletarseleccionado")
                    //{Alert.alert("",JSON.stringify(itemValor[0].valor));}
                }
            }
            guardarProccess(child, ctlLevel,valores)
        });
    }
    catch(err)
    {
        Alert.alert("",err.toString());
    }
}

export const delRowtoGroup = (parent,level,_buscado,realm)=> 
{
    try{
        for(var i=0;i<parent.Controles.length;i++)
        {
            const child = parent.Controles[i];

            let ctlLevel = level + '.' + child.Orden;
            let eliminado = false;
            if(ctlLevel === _buscado) //grupo encontrado
            {
    
                if((result = parent.Controles.filtered(`Orden = "${child.Orden}"`)).length>0)
                {
                    //ELIMINO
                    realm.delete(result); 
                    //Alert.alert("encontrado para",JSON.stringify(result));
                    eliminado = true;
                }
              break;
            }
            if(eliminado === false && child.Controles.length>0)
            {
                delRowtoGroup(child,ctlLevel,_buscado,realm);
            }
        }
    }catch(err)
    {
        Alert.alert("",err.toString());
    }
}

export const addRowtoGroup = (parent,level,_buscado,realm,newId)=> 
{
    parent.Controles.forEach(child =>
    {
        let ctlLevel = level + '.' + child.Orden;
        if(ctlLevel === _buscado) //grupo encontrado
        {
                let row = {};
                row.Tipo = "Row";
                row.Orden = newId; //child.Controles.length+1
                row.Valores = new Array();
                row.Configs = new Array();
                row.Template = new Array();
                row.Controles = new Array();

                let controlrow = realm.create('DocControl',row);

                for(var i=0;i<child.Template.length;i++)
                {
                    //ARMANDO CONTROLES DEL ROW
                    let form = {}
                    form.Tipo       = child.Template[i].Tipo;
                    form.Orden      = child.Template[i].Orden;
                    form.Valores    = addNombreValor(child.Template[i].Valores,realm);
                    form.Configs    = addNombreValor(child.Template[i].Configs,realm);
                    form.Template   = new Array();
                    form.Controles  = new Array(); //SOLO UN NIVEL PARA LOS CONTROLES
                    controlrow.Controles.push(realm.create('DocControl',form));
                }
                child.Controles.push(controlrow);
          return;
        }
        if(child.Controles.length>0)
        {
          addRowtoGroup(child,ctlLevel,_buscado,realm,newId);
        }
    });
}

function addNombreValor(lista,realm)
{
    let salida = [];
    for(var i=0;i<lista.length;i++)
    {
        let nombrevalor = {}
        nombrevalor.Nombre = lista[i].Nombre.toString();
        nombrevalor.Valor = lista[i].Valor.toString();
        salida.push(realm.create('NombreValor',nombrevalor));
    }
    return salida;
}


export const actionAddDoc = (doc)=> {
    return function (dispatch) {
        const realm = getRealm();
        realm.write(() => {realm.create("Documento",doc);});
        dispatch(actionAddDocumento(selectorDocumento(doc)))
    }
}
