import {Alert} from 'react-native'


export const selectorMenu = (_menu) =>{
    let menu = [];
    for(var i=0;i<_menu.length;i++) {
        var obj = {};
        obj._id = _menu[i]._id.$oid;
        obj.Tipo = _menu[i].Tipo;
        obj.Titulo = _menu[i].Titulo;
        obj.Modificado = _menu[i].Modificado.$date;
        obj.ModificadoUTC = _menu[i].ModificadoUTC.$date;
        //obj.FormId = _menu[i].FormId.$oid;
        obj.Items = selectorMenuAux(_menu[i].Items);
        menu.push(obj);
    }
    return menu;
}

const selectorMenuAux = (_items) =>{
    var items = [];
    for(var a=0;a<_items.length;a++) {
        var item            = {};
        item._id            = _items[a]._id.$oid;
        item.Tipo           = _items[a].Tipo;
        item.Activo         = _items[a].Activo;
        item.Titulo         = _items[a].Titulo;
        item.IconLibrary    = _items[a].IconLibrary;
        item.IconName       = _items[a].IconName;
        item.FormId         = _items[a].FormId.$oid;
        item.Items          = [];
        if(_items[a].Items.length>0)
        {
            item.Items = selectorMenuAux(_items[a].Items);
        }

        item.Style = {
            BackGroundColorActive:      _items[a].Style.BackGroundColorActive,
            BackGroundColorDisabled:    _items[a].Style.BackGroundColorDisabled,
            IconColorActive:            _items[a].Style.IconColorActive,
            IconColorDisabled:          _items[a].Style.IconColorDisabled,
            ColorActive:                _items[a].Style.ColorActive,
            ColorDisabled:              _items[a].Style.ColorDisabled
        }

        items.push(item);
    }
    return items;
}


export const selectorConsultaE = (consulta) =>{
    let salida = [];
    for(var i=0;i<consulta.length;i++)
    {
        let item = {}

        item.Rut        = consulta[i].Rut.toString();
        item.Nombre     = consulta[i].Nombre.toString();
        item.Porcentaje = consulta[i].Porcentaje.toString();
        item.Nota       = consulta[i].Nota.toString();
        item.Fecha      = consulta[i].Fecha.toString();
        item.Incumplimientos = [];

        for(var a=0;a<consulta[i].Incumplimientos.length;a++)
        {
            item.Incumplimientos.push({
                Enunciado:consulta[i].Incumplimientos[a].Enunciado.toString(),
                Documento:consulta[i].Incumplimientos[a].Documento.toString()
            })
        }
        salida.push(item);
    }
    return salida;
}

export const selectorConsultaT = (consulta) => {
    let salida = [];
    
    consulta.forEach(t => {
        let item = {
            Rut: t.Rut.toString(),
            Nombre: t.Nombre.toString(),
            FechaEvaluacion: t.FechaEvaluacion.toString(),
            Cargo: t.Cargo.toString(),
            Porcentaje: t.Porcentaje.toString(),
            Color: t.ColorNivelRiesgo.toString()
        };

        salida.push(item);
    });

    return salida;
};


export const selectorDocumentos = (docs) =>{
    let salida = [];
    for(var i=0;i<docs.length;i++)
    {
        try{
            salida.push(selectorDocumento(docs[i]));
        }catch(err)
        {
            Alert.alert("",err.toString());
        }
    }
    //ORDEN DESC POR FechaCreacion
    salida = salida.sort(function(a, b){return b.FechaCreacion - a.FechaCreacion});
    return salida;
}

export const selectorDocumento = (doc) =>{
    let newdoc  = {};
    let pages   = [];
    newdoc._id            = doc._id.$oid.toString();
    newdoc.FechaCreacion  = doc.FechaCreacion.$date;
    newdoc.FechaEnvio     = doc.FechaEnvio !== null ? parseInt(doc.FechaEnvio.$date) : null;
    newdoc.Title    = doc.Title.toString();
    newdoc.Tipo     = doc.Tipo.toString();
    newdoc.Estado   = doc.Estado
    for(var i=0;i<doc.Pages.length;i++)
    {
        let page = {}
        page.Nombre     = doc.Pages[i].Nombre.toString();
        page.Orden      = doc.Pages[i].Orden;

        page.IconName      = doc.Pages[i].IconName;
        page.IconLibrary   = doc.Pages[i].IconLibrary;
        page.IconColor     = doc.Pages[i].IconColor;

        page.Controles  = selectorDocumentos_aux(doc.Pages[i].Controles);
        pages.push(page);
    }
    newdoc.Pages = pages;

    //AÑADIR LOS TAG
    let tags = [];
    for(var i=0;i<doc.Tag.length;i++)
    {
        tags.push({Nombre:doc.Tag[i].Nombre,Valor:doc.Tag[i].Valor});
    }
    newdoc.Tag = tags;

    //Alert.alert("",JSON.stringify(newdoc));

    return newdoc;
}

function selectorDocumentos_aux(controles)
{
    let salida = [];
    if(controles !== undefined)
    for(var i=0;i<controles.length;i++)
    {
        let control = {};
        control.Tipo        = controles[i].Tipo;
        control.Orden       = controles[i].Orden;
        control.Configs     = getNombreValor(controles[i].Configs);
        control.Valores     = getNombreValor(controles[i].Valores);
        control.Controles   = selectorDocumentos_aux(controles[i].Controles);

        //OJO HACER LO SIGUIENTE EN UN TRY PUES VERSION 1 DE REALM NO CONTENDRÁ ESTE CAMPO
        try{
            control.Template    = selectorDocumentos_aux(controles[i].Template);
        }catch(err)
        {
            control.Template    = [];
        }
        salida.push(control);
    }
    return salida;
}

function getNombreValor(listado)
{
    let valores = [];
    if(listado !== undefined)
    for(var a=0;a<listado.length;a++)
    {
        valores.push({
            Nombre:listado[a].Nombre.toString(),
            Valor:listado[a].Valor.toString(),
        });
    }
    return valores;
}