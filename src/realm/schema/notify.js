
const Notify = 
{
    name: 'Notify', 
    properties: 
    {
        _id:'ObjectId',
        Titulo: 'string',
        Mensaje: 'string',
        Fecha: 'Date',
        Modificado: 'Date',
        ModificadoUTC:'Date',
        Activo:'bool',
        Read:'bool'
    }
}

export default Schema = ([Notify]);