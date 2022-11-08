//#######################  DOCUMENTO #####################################
const Documento =
{
    name: 'Documento',
    properties:
    {
        _id: 'ObjectId',
        App: 'string',
        Nombre: 'string',
        Version: 'int',
        Title: 'string',
        Tipo: 'string',
        Activo: 'bool',
        FechaEnvio: 'Date',
        FechaEnvioUTC: 'Date',
        FechaCreacion: 'Date',
        Geolocalizacion: 'Geolocalizacion?',
        Usuario: 'Usuario',
        Perfil: 'Perfil',
        Device: 'Device',
        Pages: 'DocPage[]',
        Hooks: 'Hook[]',
        Tag: 'NombreValor[]',
        Estado: 'int'
    }
}
const Empresa =
{
    name: 'Empresa',
    properties:
    {
        Rut: 'string',
        Nombre: 'string'
    }
}
const Geolocalizacion =
{
    name: 'Geolocalizacion',
    properties:
    {
        X: 'double',
        Y: 'double',
        Z: 'double?',
        Tipo: 'string',
        Precision: 'double'
    }
}
const Usuario =
{
    name: 'Usuario',
    properties:
    {
        User: 'string'
    }
}
const Device =
{
    name: 'Device',
    properties:
    {
        UserName: 'string',
        AppVersion: 'string',
        Api: 'string',
        Model: 'string',
        Version: 'string',
        Timezone: 'string',
        Tablet: 'string',
        UniqueId: 'string',
    }
}
const Hook = {
    name: 'Hook',
    properties:
    {
        Nombre: 'string',
        Configs: 'NombreValor[]'
    }
}
const DocPage =
{
    name: 'DocPage',
    properties:
    {
        Nombre: 'string',
        Orden: 'int?',
        Controles: 'DocControl[]',
        IconName: 'string?',
        IconLibrary: 'string?',
        IconColor: 'string?'
    }
}
const DocControl =
{
    name: 'DocControl',
    properties:
    {
        Tipo: 'string',
        Orden: 'int?',
        Valores: 'NombreValor[]',
        Configs: 'NombreValor[]',
        Controles: 'DocControl[]',
        Template: 'DocControl[]'
    }
}
//#######################  FIN DOCUMENTO #################################

//#######################  FORMULARIO  ###################################
const Formulario =
{
    name: 'Formulario',
    properties:
    {
        _id: 'ObjectId',
        App: 'string',
        Nombre: 'string',
        Version: 'int',
        Title: 'string',
        Tipo: 'string',
        Activo: 'bool',
        Modificado: 'Date',
        ModificadoUTC: 'Date',
        Pages: 'Page[]',
        Hooks: 'Hook[]',
        Tag: 'NombreValor[]'
    }
}
const Page =
{
    name: 'Page',
    properties:
    {
        Nombre: 'string',
        Orden: 'int?',
        Controles: 'Control[]',
        IconName: 'string?',
        IconLibrary: 'string?',
        IconColor: 'string?'
    }
}
const Control =
{
    name: 'Control',
    properties:
    {
        Tipo: 'string',
        Orden: 'int?',
        Valores: 'string[]',
        Configs: 'NombreValor[]',
        Controles: 'Control[]',
        Template: 'Control[]'
    }
}

export default Schema = ([Documento, Empresa, Geolocalizacion, Usuario, Device, Hook, DocPage, DocControl, Formulario, Page, Control]);