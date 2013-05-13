
projects.edit.createFormDB = function()
{
    if(projects.edit.formDB) return;

    var formDBModel = Ext.define('projectsFormDBModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'string' },
            {name: 'host',   type: 'string', defaultValue: '127.0.0.1'},
            {name: 'port', type: 'int',  defaultValue: '6379'},
            {name: 'database',   type: 'int',  defaultValue: '0'},
            {name: 'password',   type: 'string', defaultValue: ''},
            {name: 'free',   type: 'bool',  defaultValue: 1}
        ]
    });

    // Create the data store
    var store = Ext.create('Ext.data.ArrayStore', {
        model: formDBModel
    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    });

    projects.edit.formDB = Ext.create('Ext.grid.Panel',
    {
        store: store,

        viewConfig: {
            stripeRows: true
        },

        columns: [
            {
                text: 'Name',
                flex: 1,
                dataIndex: 'id',
                editor: {
                    allowBlank: false
                }
            },
            {
                text: 'Host',
                flex: 1,
                dataIndex: 'host',
                editor: {
                    allowBlank: false
                }
            },
            {
                text: 'Port',
                width: 60,
                dataIndex: 'port',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false
                }
            },
            {
                text: 'DB',
                width: 40,
                dataIndex: 'database',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false
                }
            },
            {
                text: 'Password',
                dataIndex: 'password',
                editor: {
                    //inputType:'password',
                    allowBlank: true
                }
            },
            {
                text: 'Free',
                width: 40,
                dataIndex: 'free',
                editor: {
                    xtype: 'checkbox',
                    stopSelection: false
                }
            }

        ],
        selModel: {
            selType: 'cellmodel'
        },
        plugins: [cellEditing],
        tbar: [
            // Add row
            {
                text: 'Add database',
                handler : function(){
                    store.insert(0, Ext.create('projectsFormDBModel', {}));
                    cellEditing.startEditByPosition({row: 0, column: 0});
                }
            },
            // Delete row
            {
                text: 'Delete',
                handler: function() {
                    projects.edit.formDB.getStore().remove( projects.edit.formDB.getSelectionModel().getLastSelected() );
                }
            }
        ]
    });

}