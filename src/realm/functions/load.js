import getRealm from '../../realm'
import {selectorDocumentos,selectorMenu,selectorConsultaE, selectorConsultaT} from '../../store/selectors'

export const readDocuments = ()=> {
    const realm = getRealm();
    let data  = realm.objects("Documento");
    data = Array.from(data, item => ({...item}))
    return selectorDocumentos(data);
}

export const readMenu = ()=> {
    const realm = getRealm();
    let data  = realm.objects("Menu");
    //console.log("DATA",data[data.length-1].Items);
    if(data.length>0)
    {
        return selectorMenu(data)[0].Items;
    }
    else
    return [];
}

export const readPerfil = (user)=> {
    const realm = getRealm();
    let perfiles  = realm.objects('Perfil').filtered(`Correo ==[c] '${user}'`);
    return perfiles[perfiles.length-1];
}

export const readForms = ()=> {
    const realm = getRealm();
    let dataForms   = realm.objects('Formulario');
    return dataForms;
}

export const readLists = ()=> {
    const realm = getRealm();
    let dataListas  = realm.objects('Lista');
    return dataListas;
}

export const readConsultaE = ()=> {
    const realm = getRealm();
    let data  = realm.objects("ConsultaE");
    data = Array.from(data, item => ({...item}))
    return selectorConsultaE(data);
}

export const readConsultaT = () => {
    const realm = getRealm();
    let data = realm.objects("ConsultaT");
    data = Array.from(data, item => ({...item}));
    return selectorConsultaT(data);
}