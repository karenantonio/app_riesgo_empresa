
import getRealm from '../index'
import { Alert } from 'react-native';

//RETORNA UN VALOR ESPECIFICANDO UNA CLAVE
export const getValue = (_property) =>{
    const realm = getRealm();
    const p = realm.objects('Property').filtered('Key = "'+_property+'"');
    if(p.length === 1){
        return p[0].Value;
    }
    return null;
}

//GRABA UN VALOR ESPECIFICANDO UNA CLAVE,VALOR (ACTUALIZANDO O EDITANDO SEGUN CORRECPONDA)
export const setValue = (_property,_value) =>{
    const realm = getRealm();
    const property = realm.objects('Property').filtered('Key = "'+_property+'"');
    if(property.length === 1)
    {
        //EDITAR:
        realm.write(() => {
            const p = realm.objects('Property').filtered('Key = "'+_property+'"');
            p[0].Value = _value;
        });
    }
    else
    {
        //CREAR
        realm.write(() => {
            const p = realm.create('Property', {Key: _property,Value: _value});
        });
    }
}

//LEE LOS ITEMS DE UNA COLECCION
export const readItemsFromCollection = (_collection)=> {
    const realm = getRealm();
    let data = realm.objects(_collection);
    if(data.length>0)
    {
        return Array.from(data, item => ({...item}));
    }
    else
    {
        return [];
    }
}

export const deleteDocument = (docId,callBack)=>{
    const realm = getRealm();
    const filter= '_id.$oid = "' + docId+'"';
    const collection = "Documento"
    realm.write(() => {
        if (realm.objects(collection).filtered(filter).length === 1) {
          realm.delete(realm.objects(collection).filtered(filter));
          callBack();
        }
    });
}

export const deleteEmptyDocument = (docId)=>{
    const realm = getRealm();
    const filter= '_id.$oid = "' + docId+'"';
    const collection = "Documento"
    realm.write(() => {
        if (realm.objects(collection).filtered(filter).length === 1) {
          realm.delete(realm.objects(collection).filtered(filter));
        }
    });
}