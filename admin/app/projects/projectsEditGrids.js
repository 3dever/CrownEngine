
projects.edit.createFormGrids = function()
{
    if(projects.edit.formGrids) return;

    var formGridsModel = Ext.define('projectsFormGridsModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'title', type: 'string' },
            {name: 'name', type: 'string' },
            {name: 'icon',   type: 'string'},
            {name: 'server', type: 'bool',  defaultValue: true},
            {name: 'client', type: 'bool',  defaultValue: false}

        ]
    });

    // Create the data store
    var store = Ext.create('Ext.data.ArrayStore', {
        model: formGridsModel
    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    });

    projects.edit.formGrids = Ext.create('Ext.grid.Panel',
        {
            store: store,

            viewConfig: {
                stripeRows: true
            },

            columns: [
                {
                    text: 'Title',
                    flex: 1,
                    dataIndex: 'title',
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    text: 'name',
                    flex: 1,
                    dataIndex: 'name',
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    text: 'Icon',
                    flex: 1,
                    dataIndex: 'icon',
                    editor: {
                        allowBlank: true
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
                        store.insert(0, Ext.create('projectsFormGridsModel', {}));
                        cellEditing.startEditByPosition({row: 0, column: 0});
                    }
                },
                // Delete row
                {
                    text: 'Delete',
                    handler: function() {
                        projects.edit.formGrids.getStore().remove( projects.edit.formGrids.getSelectionModel().getLastSelected() );
                    }
                }
            ]
        });

}