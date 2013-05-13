
users.edit.createFormDB = function()
{
    if(users.edit.formDB) return;

    var formDBModel = Ext.define('usersFormDBModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'name',   type: 'string', defaultValue: ''},
            {name: 'password',   type: 'string', defaultValue: ''},
            {name: 'role'}
        ]
    });

    // Create the data store
    var store = Ext.create('Ext.data.ArrayStore',
    {
        model: formDBModel,
        autoLoad: true,

        proxy: {
            type: 'ajax',
            url: CrownConfig.getURL("users")
        }

    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    });

    users.edit.formDB = Ext.create('Ext.grid.Panel',
        {
            store: store,

            viewConfig: {
                stripeRows: true
            },

            columns: [
                {
                    text: 'Name',
                    dataIndex: 'name',
                    width: 150,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    text: 'Password',
                    dataIndex: 'password',
                    width: 120,
                    editor: new Ext.form.TextField({
                        //inputType: 'password',
                        allowBlank: false,
                        maxLength: 20,
                        maskRe: /([a-zA-Z0-9_@#$]+)$/
                    }),
                    renderer: function(value) {
                        return Ext.String.format('******');
                    }
                },
                {
                    text: 'Role',
                    dataIndex: 'role',
                    editor: new Ext.form.field.ComboBox({
                        allowBlank: false,
                        store: [
                            ['Admin','Admin'],
                            ['Support','Support'],
                            ['Guest','Guest']
                        ],
                        listClass: 'x-combo-list-small'
                    })
                }

            ],
            selModel: {
                selType: 'cellmodel'
            },
            plugins: [cellEditing],
            tbar: [
                // Add row
                {
                    text: 'Add new user',
                    handler : function(){
                        store.insert(0, Ext.create('usersFormDBModel', {}));
                        cellEditing.startEditByPosition({row: 0, column: 0});
                    }
                },
                // Delete row
                {
                    text: 'Remove user',
                    handler: function() {
                        users.edit.formDB.getStore().remove( users.edit.formDB.getSelectionModel().getLastSelected() );
                    }
                }
            ]

        });

}