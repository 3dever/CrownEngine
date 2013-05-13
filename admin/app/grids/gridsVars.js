grids.createVarsEditor = function(grid, varsList)
{

    // Define model and store
    var model = Ext.define('GridVarsModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'name', type: 'string' },
            { name: 'value', type: 'string' }
        ]
    });
    var store = Ext.create('Ext.data.Store',
    {
        model: model,
        sorters: { property: "name", direction: "ASC" },
        sortOnLoad: true
    });

    // Create save toolbar
    grid.saveToolbar =  Ext.create('Ext.toolbar.Toolbar', {
        dock: 'bottom',
        disabled: true,
        items: [
            // Save changes
            {
                text: 'Confirm',
                scale: 'large',
                icon: 'images/icons/ok.png',
                handler: function() {
                    grid.varsEditor.save();
                    grid.saveToolbar.setDisabled(true);
                }
            },
            // Cancel changes
            {
                text: 'Cancel',
                scale: 'large',
                icon: 'images/icons/remove.png',
                handler: function() {
                    grid.varsEditor.cancel();
                    grid.saveToolbar.setDisabled(true);
                }
            }
        ]
    });

    // Create vars panel
    var varsEditor = Ext.create('Ext.grid.Panel',
    {
        store: store,

        title: 'Variables',
        region: 'east',
        frame: true,
        //collapsible: true,
        split:true,
        width: '50%',
        disabled: true,

        columns: [
            {
                text: "Name",
                dataIndex: 'name',
                editor: new Ext.form.TextField()
            },
            {
                text: "Value",
                flex: 1,
                dataIndex: 'value',
                editor: new Ext.form.TextField()
            }
        ],

        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2
            })
        ],

        listeners: {
            // Save vars to row after edit
            edit: function() {
                grid.saveToolbar.setDisabled(false);
            }
        },

        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                //ui: 'footer',
                items: [
                    // Display menu to add new var
                    {
                        text: 'Add Variable',
                        menu: {
                            items: grid.varsMenu
                        }
                    },
                    // Delete selected variable
                    {
                        text: 'Delete',
                        handler: function() {
                            store.remove( grid.varsEditor.getSelectionModel().getLastSelected() );
                            grid.saveToolbar.setDisabled(false);
                        }
                    }
                ]
            },
            grid.saveToolbar
        ]
    });

    // Load new data
    varsEditor.load = function(obj)
    {
        var gridArray = [];
        for(var prop in obj) {
            gridArray.push( [ prop, obj[prop]] ) ;
        }
        grid.varsEditor.getStore().loadData(gridArray);
    }

    // Save vars to selected row
    varsEditor.save = function()
    {
        var gridRecords = store.getRange();
        var gridArray = {};
        for (i=0; i<gridRecords.length; i++) {
            gridArray[gridRecords[i].data.name] = gridRecords[i].data.value;
            //gridArray.push([gridRecords[i].data.name, gridRecords[i].data.value]);
        }
        grid.table.getSelectionModel().getLastSelected().set("vars", gridArray);
        // Refresh date
        grid.table.updateCurrentRowDate();
    }

    // Cancel changes
    varsEditor.cancel = function()
    {
        var oldVars = grid.table.getSelectionModel().getLastSelected().get("vars");
        grid.varsEditor.getStore().loadData(oldVars);
    }
    return varsEditor;
}