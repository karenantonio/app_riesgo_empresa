import { getJsonFromApi } from './common'
import getRealm from '../realm'
import { Alert } from 'react-native'
import { OLD_FORMULARIOS, NEW_FORMULARIOS } from 'react-native-dotenv'

export const syncCollection = async (_collection, _params, _fromService, _url, _logFunction, _force) => {
    //REVISAR LA FECHA DE MODIFICACION DE LA COLECCION

    if (_collection === 'Formulario' && _url === OLD_FORMULARIOS) {
        _url = NEW_FORMULARIOS + JSON.parse(_params.user).username + '/' + _params.application
    }

    const realm = getRealm();

    //LEER LA COLECCION
    const collection = realm.objects(_collection);

    //PARAMETROS A ENVIAR
    let parametros = {
        ..._params,
        modificadoUTC: 0
    };

    if (!_force && _collection === "ConsultaE" && collection.length > 0) {
        parametros.modificadoUTC = collection[0].ModificadoUTC.$date;
    }
    if (!_force && _collection === "ConsultaT" && collection.length > 0) {
        parametros.modificadoUTC = collection.sorted('ModificadoUTC.$date', true)[0].ModificadoUTC.$date;
    }
    if (_collection === "Lista") {
        parametros.listas = lastUTCFromActiveForms(collection, realm, _force);
    }

    //CONSULTA AL SERVIDOR
    const request = await getJsonFromApi(_url, parametros, _logFunction);

    //Alert.alert("",JSON.stringify(request));

    //EVALUAR RESPUESTA SI NO RETORNAR... AQUI FALTARIA INCORPORAR VALIDACION

    if (!request.message) {
        _logFunction("INFO", "Guardando datos de api (" + _collection + ") en local");

        if (_collection === "Perfil") {
            realm.write(() => {
                if ((result = collection.filtered(`_id = "${request._id}"`)).length > 0) {
                    //ELIMINO
                    realm.delete(result);
                }
                //CREO REGISTRO : 
                try {
                    realm.create(_collection, request);
                } catch (err) {
                    //Alert.alert("",err);
                }
            });
        }
        else {
            //PROCESO: SI NO EXISTE EL ITEM  DE LIST DEVUELTO; AGREGO Y SI EXISTE; ELIMINO Y AGREGO
            request.forEach(itemCollection => {
                realm.write(() => {
                    if ((result = collection.filtered(`_id.$oid = "${itemCollection._id.$oid}"`)).length > 0) {
                        //ELIMINO
                        realm.delete(result);
                    }
                    //CREO REGISTRO : 
                    try {
                        realm.create(_collection, itemCollection);
                    } catch (err) {
                        console.log(err.message);
                    }
                });
            });
        }
    }
    else {
        if (_fromService === false) {
            _logFunction("ERROR", "Error en petición API (" + _collection + "). URL: " + _url + ". Mensaje: " + request.message);
            //Alert.alert("Error en petición API:", _collection + ": " + _url + "." + request.message + ". Parametros: " + JSON.stringify(parametros));
        }
    }
}

const lastUTCFromActiveFormsAux = (parent, level) => {
    let items = [];
    //RECORRER CONTROLES EN BUSCA DE AUTOCOMPLETAR
    parent.Controles.forEach((control) => {
        if (control.Controles.length > 0) {
            //SI TIENE SUB-CONTROLES
            items = [...items, ...lastUTCFromActiveFormsAux(control, level + '.' + control.Orden)];
        }
        else {
            if (control.Tipo == "Autocompletar") {
                const lista = control.Configs.filter(row => row.Nombre === "lista")[0].Valor;
                items.push(lista);
            }
        }
    });
    return items;
}

const lastUTCFromActiveForms = (arrayLists, realm, _force) => {

    //BUSCAR LISTAS EXISTENTES EN FORMULARIOS ACTIVOS:
    let listas = [];
    const forms = realm.objects("Formulario").filtered(`Activo = True`);
    forms.forEach((form) => {
        form.Pages.forEach((pagina) => {
            let items = lastUTCFromActiveFormsAux(pagina, pagina.Orden);
            //Alert.alert("",JSON.stringify(items));
            listas = [...listas, ...items];
        });
    });
    listas = [...new Set(listas)];

    //AHORA PROCEDO A BUSCAR EN LAS LISTAS
    let salida = [];
    arrayLists.forEach((item) => {
        //SI LA LISTA ESTA DENTRO DEL ARRAY DE LISTAS DE FORMULARIOS ACTIVOS
        if (listas.indexOf(item.Codigo) !== -1) {
            if (_force) {
                salida.push({ lista: item.Codigo, modificadoUTC: 0 });
            }
            else {
                salida.push({ lista: item.Codigo, modificadoUTC: item.ModificadoUTC.$date });
            }
        }
    });
    return salida;
}

const sortLastUTC = (array) => {
    let list = [];
    array.map((item) => {
        list.push(item.ModificadoUTC.$date);
    });
    list = list.sort(function (a, b) { return b - a }); //ORDEN DESCENDENTE
    return list[0];
}