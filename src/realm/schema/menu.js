const Menu = 
{
    name: 'Menu', 
    properties: 
    {
        _id: 'ObjectId',
        Items: 'MenuItem[]',
        Tipo:'string',
        Modificado: 'Date',
        ModificadoUTC:'Date',
        FormId: 'ObjectId?'
    }
}
const MenuItem = 
{
    name: 'MenuItem', 
    properties: 
    {
        _id: 'ObjectId',
        Titulo: 'string',
        Items: 'MenuItem[]',
        FormId: 'ObjectId?',
        Activo:'bool',
        Tipo:'string',
        IconLibrary: 'string',
        IconName: 'string',
        Style: 'MenuStyle'
    }
}

const MenuStyle = 
{
    name: 'MenuStyle', 
    properties: 
    {
        BackGroundColorActive: 'string',
        BackGroundColorDisabled: 'string',
        IconColorActive: 'string',
        IconColorDisabled: 'string',
        ColorActive:'string',
        ColorDisabled:'string'
    }
}



export default Schema = ([Menu,MenuItem,MenuStyle]);