
grids.createTable = function(grid)
{
    // Add grouping
    var gridGrouping = Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: 'Group: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        hideGroupedHeader: true
    });

    // Create the grid
    var title = grid.name + " list";
    title = title.charAt(0).toUpperCase() + title.substr(1).toLowerCase();

    var table = Ext.create('Ext.grid.Panel',
    {
        title: title,
        region: 'center',
        store: grid.store,
        frame:true,

        flex: 1,
        //features: [gridGrouping],

        columns: [
            /*{
                text: "Group",
                width: 100,
                //hidden: true,
                dataIndex: 'group',
                editor: new Ext.form.TextField()
            },*/
            {
                text: "Id",
                width: 50,
                dataIndex: 'id',
                editor: new Ext.form.Number()
            },
            {
                text: "Name",
                flex: 1,
                dataIndex: 'name',
                editor: new Ext.form.TextField()
            },
            {
                text: "Updated",
                width: 120,
                dataIndex: 'updated'
            }
            /*{
                text: "Vars",
                //width: 100,
                dataIndex: 'vars'
            } */
        ],

        // Load vars on click
        listeners: {
            itemclick: function (view, record, item, index)
            {
                // Load vars
                grid.varsEditor.load(record.get('vars'));
                // Enable editors
                grid.varsEditor.setDisabled(false);
            }
        },

        // Open edit form on click
        plugins: [
            Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToEdit: 2
            })
        ],

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            //ui: 'footer',
            items: [
                    // Add row
                    {
                        text: 'Add',
                        handler: function() {
                            grid.store.add({
                                id: grid.store.getCount(),
                                name: 'new'
                            } );
                        }
                    },
                    // Delete row
                    {
                        text: 'Delete',
                        handler: function()
                        {
                            grid.varsEditor.setDisabled(true);
                            grid.varsEditor.getStore().loadData([]);
                            grid.store.remove( grid.table.getSelectionModel().getLastSelected() );
                        }
                    },
                    ,'->'
                ]
            },
            {
                xtype: 'toolbar',
                dock: 'bottom',
                //ui: 'footer',
                items: [
                    // Save grid to server
                    {
                        text: 'Save to server',
                        icon: 'images/icons/download.png',
                        scale: 'large',
                        scope: this,
                        handler: function()
                        {
                            // Encode array
                            gridRecords = grid.store.getRange();
                            gridArray = [];
                            for (i=0; i<gridRecords.length; i++) {
                                gridArray.push(gridRecords[i].data);
                            }
                            jsonData = Ext.JSON.encode(gridArray);

                            // Save to server
                            CrownServer.deploy(grid.serverURL, grid.deployKey, "grid", grid.name, jsonData);
                        }
                    },
                    // Save grid to client
                    {
                        text: 'Upload to cient',
                        icon: 'images/icons/download.png',
                        scale: 'large',
                        scope: this,
                        handler: function()
                        {
                            // Encode array
                            gridRecords = grid.store.getRange();
                            gridArray = [];
                            for (i=0; i<gridRecords.length; i++) {
                                gridArray.push(gridRecords[i].data);
                            }
                            jsonData = Ext.JSON.encode(gridArray);

                            // Save to client
                            Ext.Ajax.request(
                            {
                                url: grid.clientGridsURL,
                                method: 'POST',
                                params: {
                                    "data": jsonData
                                },
                                failure: function(response, opts)
                                {
                                    Ext.MessageBox.alert('Save error', "Can't save grid to client", response.status);
                                }
                            });

                        }
                    }
                ]
            }
        ]

    });

    // Refresh updated date of current selected row
    table.updateCurrentRowDate = function ()
    {
        var now = new Date();
        var dateString = Ext.Date.format(now, "y-m-d, H:i:s");
        var row = grid.table.getSelectionModel().getLastSelected();
        row.set("updated", dateString);
    };

    return table;
}

