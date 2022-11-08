const Perfil = 
{
    name: 'Perfil', 
    properties: 
    {
        _id: 'string',
        Rut:'string',
        Nombre: 'string',
        Correo: 'string',
        Permisos: 'Permisos[]'
    }
}

const Permisos = 
{
    name: 'Permisos', 
    properties:
    {
        Form: 'string',
        FormId: 'string'
    }
}

export default Schema = ([Perfil,Permisos]);