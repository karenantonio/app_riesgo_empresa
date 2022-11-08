const NombreValor =
{
    name: 'NombreValor',
    properties:
    {
        Nombre: 'string',
        Valor: 'string'
    }
}
const ObjectId =
{
    name: 'ObjectId',
    properties:
    {
        $oid: 'string'
    }
}
const Date =
{
   name: 'Date',
   properties:
   {
       $date: 'int'
   }
}
const Foto =
{
   name: 'Foto',
   properties:
   {
       $base64: 'string'
   }
}
const Property = 
{
    name: 'Property', 
    properties: 
    {
        Key: 'string',
        Value: 'string'
    }
}

export default Schema = ([NombreValor,ObjectId,Date,Foto,Property]);