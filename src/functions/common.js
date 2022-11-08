import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number'
import { getValue } from '../realm/functions/common'

export const getDeviceInfo = () => {
    let data = {};
    data.UserName = getValue("username");
    data.AppVersion = VersionNumber.appVersion;
    data.Api = DeviceInfo.getAPILevel().toString();
    data.Model = DeviceInfo.getModel().toString();
    data.Version = DeviceInfo.getSystemVersion().toString();
    data.Timezone = DeviceInfo.getTimezone().toString();
    data.Tablet = DeviceInfo.isTablet().toString();
    data.UniqueId = DeviceInfo.getUniqueID().toString();
    return data;
};

export const getJsonFromApi = async (URL, PARAMS, _logFunction) => {
    _logFunction("INFO", "Solicitando Api '" + URL + "'");
    return await fetch(URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', },
        body: JSON.stringify(PARAMS),
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                //Alert.alert("",JSON.stringify(response) + " params: " + JSON.stringify(PARAMS));
                return { state: false, response };
            }
        })
        .then((response) => {
            if (response.state === false) {
                //EXISTE UN CODIGO CON MENSAJE DIFERENTE A 200
                return { message: JSON.stringify(response) };
            }
            else {
                //RETORNA DATOS EN FORMATO JSON
                return response;
            }
        })
        .catch((error) => {
            //Alert.alert("",JSON.stringify(error));
            return { message: error };
        });
};

export const validarCheck = (values) => {

    //estos let correponden a los checkm
    let valid = false;
    let p = 0;

    //este let force obliga al loop a mostrar solo un registro
    let force = false;
    let message = "";
    values.map(val => {
        //estos if son la validacion de paginas incompletas solo para checkm
        if (val.tipo == "CheckM" && val.clave == "presionado") {
            i++;
        }
        if (val.tipo == "CheckM" && val.clave == "presionado" && val.valor !== "") {
            p++;
        }
        if (force === false && p == 0) {
            force = true;
            valid = false;
            message += "Para ingresar un Compromiso debe completar todo el Check de Monitoreo.";
        }
    });
    return { valid, message };
};

export const validateDocValues = (_values, _pages) => {
    // console.log("VALIDAR DOC:", _values);
    let ipsv = false;
    let po_preguntas = [];
    let preguntas = 0;

    _pages.map(paginas => {
        const configs = paginas.Controles.map((item) => item.Configs);
        ipsv = configs.flat().find(item => item.Nombre === "IPS_required")?.Valor
    })

    //RECIBE EL ARRAY DE VALORES: [{id,tipo,clave,valor,configs}]
    //Y RETORNA: {valid:false,message:'campo xx debe tener valor'}

    // Corresponde al IPS
    let ips = 1;
    let ips_rutas = 0
    let ips_estado = 0

    let valid = true;
    let empty = true;
    //estos let correponden a los checkm
    let i = 0;
    let p = 0;
    //estos let correponden a los check
    let q = 0;
    let l = 0;
    //este let force obliga al loop a mostrar solo un registro
    let force = false;
    let message = "";
    let conta_val = 1;

    //Validar IPS y/o Monitoreo 
    let ruta = 0;
    let check = true;

    // Validar CheckMMH
    let pauta;
    let faena;
    let cargo;
    let notaMMH
    let CheckMMH = 0;
    let validateCheck = 0;
    let conta_val_check = 0;
    let no = 0;
    let obs = 0;

    _values.map(val => {

        if (val.clave === 'nota' && val.valor == '') {
            message += '\- Formulario sin nota calculada, debe dirigirse a observaciones generales.\n'
        }


        // Valida si se responder checkmmh segun la convinacion seleccionada
        if (val.tipo == "Lista") {
            let campo = val.configs.filter(row => row.Nombre === "titulo")[0].Valor;
            if (campo === "Tipo Pauta") {
                pauta = val.valor
            };
            if (campo === "Faena") {
                faena = val.valor
            };
            if (campo === "Cargo") {
                cargo = val.valor
            };
        };

        if (pauta !== undefined && faena !== undefined && cargo !== undefined) {
            validateCheck++
        }

        if (val.tipo === "CheckMMH") {

            // console.log(val.configs.filter(row => row.Nombre === "combinacion")[0].Valor.includes(`${pauta},${faena},${cargo}`))
            if (val.configs.filter(row => row.Nombre === "combinacion")[0].Valor.includes(`${pauta},${faena},${cargo}`)) {

                //estos if son la validacion de paginas incompletas solo para check
                if (val.tipo == "CheckMMH" && val.clave == "observaciones" && val.valor !== "") {
                    if (val.valor[0].gravedad) {
                        console.log("CheckMMH", val)
                        obs++;
                    }
                }
                if (val.tipo == "CheckMMH" && val.valor === "no") {
                    no++
                }
                if (val.tipo == "CheckMMH" && val.clave == "presionado") {
                    i++;
                }
                if (val.tipo == "CheckMMH" && val.clave == "presionado" && val.valor !== "") {

                    p++;
                }
                if (i !== p && force === false && p > 0) {
                    force = true;
                    valid = false;
                } else if (i == p && i > 0) {
                    conta_val_check++;
                    validateCheck = 0
                }

                if (val.valor == "") {
                    CheckMMH++;
                } else {
                    CheckMMH = 0;
                }
            };
        };

        //estre if valida el requerimiento de los controles individualmente
        if (val.tipo == "Texto" || val.tipo == "Autocompletar" || val.tipo == "AutocompletarText" || val.tipo == "FirmaDigital" || val.tipo == "CodigoQR" || val.tipo == "Lista" || val.tipo == "Foto" || val.tipo == "Fecha" || val.tipo == "GrupoOPS") {
            let requerido = val.configs.filter(row => row.Nombre === "requerido");
            if (val.valor == "" && requerido[0].Valor == "True") {
                let campo = val.configs.filter(row => row.Nombre === "titulo")[0].Valor;
                valid = false;
                message += "- " + campo + ". \n";
            }
        }

        // Valida si se ingresaron IPS
        if (val.tipo === "GrupoIPS" && val.clave === "rutas" && val.valor !== "" && val.valor.length !== 0) {
            ruta++;
        }

        if (val.tipo === "GrupoIPS" && val.clave === "estado" && val.valor !== "" && val.valor !== "1") {
            ruta++;
        }

        // Valida si se ingresaron IPS  
        if (val.tipo === "GrupoIPS" && val.clave === "rutas" && val.valor !== "" && val.valor.length !== 0) {
            ruta++;
        }
        //  Valida si se ingresaron IPS
        if (val.tipo === "GrupoIPS" && val.clave === 'rutas' && val.valor.length > 0) ips_rutas++;
        if (val.tipo === "GrupoIPS" && val.clave === 'estado' && val.valor === '0') ips_estado++;
        if (val.tipo === "GrupoIPS" && val.clave === 'rutas') ips = 0

        // Valida si se empezó el check.
        if (val.clave === "nota" && val.valor !== "") {
            check = true;
        }

        //estos if son la validacion de paginas incompletas solo para checkm
        if (val.tipo == "CheckM" && val.clave == "presionado") {
            i++;
        }
        if (val.tipo == "CheckM" && val.clave == "presionado" && val.valor !== "") {
            p++;
        }
        if (i !== p && force === false && p > 0) {
            force = true;
            valid = false;
            message += "-Debe terminar el Check que ha comenzado. \n";
            conta_val++;
        } else if (i == p && i > 0) {
            conta_val++;
        }
        //estos if son la validacion de paginas incompletas solo para check
        if (val.tipo == "Check" && val.clave == "presionado") {
            q++;
        }
        if (val.tipo == "Check" && val.clave == "presionado" && val.valor !== "") {
            l++;
        }
        if (q !== l && force === false && l > 0) {
            force = true;
            valid = false;
            message += "- Debe terminar el Check que ha comenzado. \n";
        }

        //este if valida que no se pueda enviar un check si esta con "no aplica en su 100%"
        if (val.clave == "nota" && val.valor == "N A") {
            valid = false;
            message += "-No se puede enviar una Evaluación que 'No Aplique' en su totalidad. \n";
        }
    });

    // Valida que se ingresen IPS en formulario
    if (ipsv == 'True') {
        if (ips == 1) { ips_estado = 1; ips_rutas = 1; }
        //  Valida que el ips no esten vacios
        if (ips_estado == 1) { ips_rutas = 1 }

        if (ips_rutas == 1) { ips_estado = 1 }

        if (ips_rutas == 0 || ips_estado == 0) {
            valid = false;
            message += '- No se ingresaron IPS. \n'
        }
    };

    // Recupero numero de preguntas del formulario activo del control CheckMMH
    _pages.map(paginas => {
        const control_preguntas = paginas.Controles.map((item) => item.Controles.filter(con => con.Tipo === "CheckMMH")).flat()
        po_preguntas = control_preguntas.map(pre => JSON.parse(pre.Configs.filter(con => con.Nombre === "combinacion")[0]?.Valor))

        if (po_preguntas.map(po => po.filter(con => con === `${pauta},${faena},${cargo}`).flat()).flat().length > 0) {
            preguntas = preguntas + po_preguntas.map(po => po.filter(con => con === `${pauta},${faena},${cargo}`).flat()).flat().length
        }
    })

    console.log('obs', obs)
    console.log('no', no)
    if (obs < no) {
        valid = false;
        message += '\nAtención, los inclumimientos deben llevar observación.'
    }

    if (preguntas > p) {
        valid = false;
        message += '\nAtención, Debe responder todas las preguntas del Formulario.'
        validateCheck = 0
    }


    //console.log("LOG RUTA",ruta);
    // if (ruta == 0 && check == false || !valid) {
    //     valid = false;
    //     message += "- Para enviar debe al menos haber completado el Monitoreo, o bien, generar un IPS. \n";
    // }
    // if (conta_val_check < 2) {
    //     valid = false;
    //     message += 'Debe completar el apartado de preguntas del Formulario.'
    // }


    return { valid, message };
};

export const validateEmptyDoc = (_values, _pages) => {

    let empty = true;

    //estos let correponden a los checkm
    let i = 0;
    let p = 0;

    //estos let correponden a los check
    let q = 0;
    let l = 0;

    //este let force obliga al loop a mostrar solo un registro
    let conta_val = 1;
    _values.map(val => {
        //estre if valida el requerimiento de los controles individualmente
        if (val.tipo == "Texto" || val.tipo == "Autocompletar" || val.tipo == "AutocompletarText" || val.tipo == "FirmaDigital" || val.tipo == "CodigoQR" || val.tipo == "Lista" || val.tipo == "Foto" || val.tipo == "Fecha") {
            if (val.valor != "") {
                empty = false;
            }
        }
        //estos if son la validacion de paginas incompletas solo para checkm
        if (val.tipo == "CheckM" && val.clave == "presionado") {
            i++;
        }
        if (val.tipo == "CheckM" && val.clave == "presionado" && val.valor !== "") {
            p++;
        }
        if (i !== p && p > 0) {
            empty = false;
        }
        //estos if son la validacion de paginas incompletas solo para check
        if (val.tipo == "Check" && val.clave == "presionado") {
            q++;
        }
        if (val.tipo == "Check" && val.clave == "presionado" && val.valor !== "") {
            l++;
        }
        if (q !== l && l > 0) {
            empty = false;
        }
    });
    return empty;
};

export const createDocFromForm = (_form, _perfil, _device, _userCognitoString) => {
    //ARMAR EL DOCUMENTO A PARTIR DEL FORMULARIO -> DOC EN BLANCO
    let doc = {};
    doc._id = { $oid: getUID() };
    doc.App = _form.App;
    doc.Nombre = _form.Nombre;
    doc.Version = _form.Version;
    doc.Title = _form.Title;
    doc.Tipo = _form.Tipo;
    doc.Activo = _form.Activo;
    doc.FechaEnvio = null;
    doc.FechaEnvioUTC = null;
    doc.FechaCreacion = { $date: new Date().getTime() };
    doc.Geolocalizacion = null;
    doc.Usuario = { User: _userCognitoString };
    doc.Perfil = _perfil;
    doc.Device = _device;
    doc.Hooks = _form.Hooks;
    doc.Tag = _form.Tag;
    doc.Estado = 1;

    let DocPages = new Array();
    _form.Pages.sorted('Orden').map(pagina => {
        //CREAMOS UNA PAGINA DE DOCUMENTO:
        let DocPage = {};
        DocPage.Nombre = pagina.Nombre;
        DocPage.Orden = pagina.Orden;
        DocPage.IconName = pagina.IconName;
        DocPage.IconLibrary = pagina.IconLibrary;
        DocPage.IconColor = pagina.IconColor;
        DocPage.Controles = getControles(pagina, pagina.Orden);
        DocPages.push(DocPage);
    });
    doc.Pages = DocPages;
    //DOC LISTO!!!
    return doc;
};

export const getUID = () => {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
};

const getControles = (parent, level) => {
    let controles = new Array();
    parent.Controles.sorted('Orden').map(child => {
        let DocControl = {};
        DocControl.Tipo = child.Tipo;
        DocControl.Orden = child.Orden;
        DocControl.Valores = new Array();
        for (var i = 0; i < child.Valores.length; i++) {
            DocControl.Valores.push({ Nombre: child.Valores[i], Valor: JSON.stringify("") });
        }
        DocControl.Configs = child.Configs;
        DocControl.Controles = getControles(child, level + '.' + child.Orden);
        if (child.Template !== undefined && child.Template.length > 0) {
            DocControl.Template = getTemplate(child.Template);
        }
        else {
            DocControl.Template = new Array();
        }
        controles.push(DocControl);
    });
    return controles;
};

//TEMPLATE USA LA MISMA CONFIGURACION DE UN CONTROL (los template no son recursivos solo controles unicos sin anidacion)
const getTemplate = (template) => {
    let controles = new Array();
    template.sorted('Orden').map(child => {
        let DocControl = {};
        DocControl.Tipo = child.Tipo;
        DocControl.Orden = child.Orden;
        DocControl.Valores = new Array();
        for (var i = 0; i < child.Valores.length; i++) {
            DocControl.Valores.push({ Nombre: child.Valores[i], Valor: JSON.stringify("") });
        }
        DocControl.Configs = child.Configs;
        DocControl.Template = new Array();
        controles.push(DocControl);
    });
    return controles;
};
