const ConsultaE = 
{
    name: 'ConsultaE', 
    properties: 
    {
        _id: 'ObjectId',
        Rut: 'string',
        Nombre: 'string',
        Porcentaje: 'string',
        Nota: 'string',
        Fecha: 'string',
        Incumplimientos: 'Incumplimiento[]',
        Modificado: 'Date',
        ModificadoUTC:'Date'
    }
}

const Incumplimiento = 
{
    name: 'Incumplimiento', 
    properties: 
    {
        Enunciado: 'string',
        Documento: 'string'
    }
}

export default Schema = ([ConsultaE,Incumplimiento]);