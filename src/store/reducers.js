import CONSTANTES from './consts'


const simpleReducer = (state,action,label) =>{
    switch (action.type){
        case label:
            return action.value;
        default:
            return state;
    }
}

const remember  = (state=[],action)=>{return simpleReducer(state,action,'SET_REMEMBER');};
const username  = (state=[],action)=>{return simpleReducer(state,action,'SET_USERNAME');};
const password  = (state=[],action)=>{return simpleReducer(state,action,'SET_PASSWORD');};
const cognito   = (state=[],action)=>{return simpleReducer(state,action,'SET_COGNITO');};


//CREANDO NUEVO REGISTRO DE ROW (GUARDA ID DE ROW O VACIO)   
const reducerNewRow = (state="",action)=>{
    return simpleReducer(state,action,CONSTANTES.SET_NEW_ROW);
};

//PERFIL
const reducerPerfil = (state=[],action)=>{
    switch (action.type){
        case CONSTANTES.SET_PERFIL:
            return action.perfil;
        break;
        default:return state;
    }
};

//MENU
const reducerMenu = (state=[],action)=>{
    switch (action.type){
        case CONSTANTES.SET_MENU:
            return action.menu;
        break;
        default:return state;
    }
};

//LOG
const reducerLog = (state=[],action)=>{
    switch (action.type){
        case CONSTANTES.ADD_LOG:
            let data = [...state];
            data.push({log:action.log,title:action.title});
            return data;
        break;
        case CONSTANTES.SET_LOG:
            return action.log;
        break;
        default:return state;
    }
};

//DOCUMENTOS    
const reducerDocumentos = (state=[],action)=>{
    switch (action.type){
        case CONSTANTES.SET_DOCUMENTOS:
            return action.value;
        break;
        case CONSTANTES.ADD_DOCUMENTO:
            return [...state,action.doc];
        break;
        case CONSTANTES.DEL_DOCUMENTO:
            return [...state.filter(row=>row._id !== action._id)];
        break;
        case CONSTANTES.UPDATE_DOCUMENTO:
            let data = [...state.filter(row=>row._id !== action._id)];
            data.push(action._doc);
            return data;
        break;
        case CONSTANTES.SEND_DOCUMENTO:
            let data_s = [...state];
            for(var i=0;i<data_s.length;i++)
            {
                if(data_s[i]._id === action.id)
                {
                    //Alert.alert("",JSON.stringify(action.fechaOBJ));
                    data_s[i].Estado = action.estado;
                    data_s[i].FechaEnvio = action.fechaOBJ.$date;
                    data_s[i].FechaEnvioUTC = action.fechaOBJ.$date
                    if(action.gps !== null)
                    {
                        data_s[i].Geolocalizacion = {
                            X: action.gps.coords.latitude,
                            Y: action.gps.coords.longitude,
                            Z: action.gps.coords.altitude,
                            Tipo: action.gps.Tipo,
                            Precision: action.gps.coords.accurancy
                        };
                    }
                }
            }
            return data_s;
        break;
        default:
        return state;
    }
};


//VALORES DE CONTROL DE DOCUMENTO ACTUALMENTE CARGARDO
// [{id,tipo,clave,valor}]
const reducerValores = (state=[],action)=>{
    let valores = [...state];
    const id    = action.id + action.tipo + action.clave;
    switch (action.type){
        case CONSTANTES.SET_VALOR_CONTROL:
            //BUSCAR EN ESTADO ANTERIOR Y ACTUALIZAR
            for (var i = 0; i < valores.length; i++) {
                if (valores[i].id == id) {
                    valores[i].valor = action.valor; 
                    break;
                }
            }
            return valores;
        break;
        case CONSTANTES.INSERT_VALOR_CONTROL:
            //SE AÑADE FUNCION PARA ADEMÁS SI YA EXISTE LA KEY SE REEMPLAZA:
            let encontrado = false;
            for (var i = 0; i < valores.length; i++) {
                if (valores[i].id == id) {
                    valores[i].valor = action.valor; 
                    encontrado = true;
                    break;
                }
            }
            if(encontrado === false)
            {
                valores.push({id,tipo:action.tipo,clave:action.clave,valor:action.valor,configs:action.configs});
            }
            return valores;
        break;
        case CONSTANTES.CLEAR_VALOR_CONTROL:
           return [];
        break;
        default:
            return state;
    }
}; 


const reducerCheckActivo = (state=[],action)=>{
    return simpleReducer(state,action,CONSTANTES.SET_CHECK_ACTIVO);
};

const reducerCheckDefaultValues = (state=[],action)=>{
    return simpleReducer(state,action,CONSTANTES.SET_CHECK_DEFAULT_VALUES);
};


export default {remember,username,password,cognito,reducerLog,reducerDocumentos,reducerPerfil,reducerMenu,reducerValores,reducerCheckActivo,reducerNewRow,reducerCheckDefaultValues}
