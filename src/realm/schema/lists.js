const Lista = 
{
    name: 'Lista', 
    properties: 
    {
        _id: 'ObjectId',
        Codigo: 'string',
        Items:'ListaItem[]',
        Modificado: 'Date',
        ModificadoUTC:'Date'
    }
}


const ListaItem = 
{
    name: 'ListaItem', 
    properties: 
    {
        Texto1: 'string?',
        Texto2: 'string?',
        Texto3: 'string?',
        Texto4: 'string?',
        Texto5: 'string?',
        Texto6: 'string?',
        Texto7: 'string?'
    }
}

export default Schema = ([Lista,ListaItem]);