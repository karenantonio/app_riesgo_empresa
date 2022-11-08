import common from './schema/common';
import fd from './schema/fd';
import lists from './schema/lists';
import menu from './schema/menu';
import notify from './schema/notify';
import perfil from './schema/perfil';
import consultaE from './schema/consultaE';
import consultaT from './schema/consultaT';
import projectSchema from '../project/realm/schema';

export default getRealm = () => {
    const schema = [
        ...projectSchema,
        ...common,
        ...fd,
        ...lists,
        ...menu,
        ...notify,
        ...perfil,
        ...consultaE,
        ...consultaT
    ];
    const Realm = require('realm');
    return new Realm({
        schema, schemaVersion: 5
    });
}