const ConsultaT = 
{
    name: 'ConsultaT', 
    properties: 
    {
        _id: 'ObjectId',
        Rut: 'string',
        Nombre: 'string',
        FechaEvaluacion: 'string',
        Cargo: 'string',
        Porcentaje: 'string',
        ColorNivelRiesgo: 'string',
        Modificado: 'Date',
        ModificadoUTC:'Date'
    }
}

export default Schema = ([ConsultaT]);