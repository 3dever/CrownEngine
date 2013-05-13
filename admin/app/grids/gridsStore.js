/*
 * Projects Model and Store
 */

grids.createStore = function(grid)
{
    // Define model
    var model = Ext.define('GridsModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'group', type: 'string' },
            { name: 'updated', type: 'string' },
            { name: 'vars', type: 'array' }
        ]
    });

    // Create store
    var store = Ext.create('Ext.data.JsonStore',
        {
            model: 'GridsModel',
            autoLoad: true,

            sortOnLoad: true,
            sorters: { property: "id", direction: "ASC" },
            groupField: 'group',

            proxy: {
                type: 'ajax',
                url: grid.dataURL,
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }

        });

    return store;
}