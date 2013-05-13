
var grids =
{
    addEditorTab: function(title, icon, gridName)
    {
        selectedProject = projects.tree.getSelectionModel().getLastSelected();

        var grid =
        {
            project: selectedProject,
            name: gridName,
            deployKey: selectedProject.get('deployKey'),

            serverURL: selectedProject.get('serverURL'),
            dataURL: selectedProject.get('serverURL') + 'config/?key=' + selectedProject.get('deployKey') + '&type=grid&name=' + gridName,
            clientGridsURL: selectedProject.get('clientGridsURL') + "?key=" + selectedProject.get('clientGridsKey') + "&name=" + gridName,

            defaultVars: null,
            varsMenu: [{
                text: "string",
                handler: function (item) {
                    grid.varsEditor.store.add( {name: item.text} );
                }
            }],

            store: null,
            table: null,
            varsEditor: null
            //selectedItem: null
        }

        //var assetsURL = projectItem.get('assets');
        //var varsList = item.get('vars');

        var varsList = "name, position";

        // Load default vars
        var defaultVarsStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,
            fields: ['id'],
            proxy: {
                type: 'ajax',
                url: 'config/vars/default.json',
                reader: {
                    type: 'json'
                }
            },
            listeners: {
                load: function()
                {
                    grid.defaultVars = defaultVarsStore.proxy.reader.jsonData[gridName];

                    // Add var types to menu
                    for(var id in grid.defaultVars)  {
                        grid.varsMenu.push({
                            text: grid.defaultVars[id]["name"],
                            handler: function (item) {
                                grid.varsEditor.store.add( {name: item.text} );
                            }
                        });
                    }
                }
            }
        });

        // Load grid store
        grid.store =  grids.createStore(grid);
        grid.table = grids.createTable(grid);
        grid.varsEditor = grids.createVarsEditor(grid, varsList);

        // Add new tab or activate already added
        var tab = app.tabPanel.add({
            title: grid.project.get('name') + " - " +  title, // + ' - ' + dataURL.replace('http://', ''),
            icon: icon,
            closable: true,
            layout: 'border'
        });
        app.tabPanel.setActiveTab(tab);

        tab.add(grid.table);
        tab.add(grid.varsEditor);

    }
}