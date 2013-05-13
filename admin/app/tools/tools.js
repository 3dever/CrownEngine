
var tools = {

    gridsList: null,
    toolbar: null,

    enable : function()
    {
        tools.updateGridsList();
        tools.toolbar.enable();
    },

    disable: function()
    {
       tools.toolbar.disable();
    },

    // Create grids list from selected project parameters
    updateGridsList : function()
    {
        var selectedProject = projects.tree.getSelectionModel().getLastSelected();
        if(!selectedProject) return;

        tools.gridsList.removeAll();

        var nodes = selectedProject.get('gridsList');
        for(var id in nodes)
        {
            var node = nodes[id];
            tools.gridsList.add({
                    text: node.title, //'Scenes Editor',
                    icon: node.icon, //'images/icons/home.png',
                    gridName: node.name,
                    handler: function() {
                        grids.addEditorTab(this.text, this.icon, this.gridName);
                    }
                } );

        }

        /*[
            {
                text: 'Scenes Editor',
                icon: 'images/icons/home.png',
                handler: function() {
                    grids.addEditorTab(this.text, this.icon, "scenes");
                }
            },
            {
                text: 'Entities Editor',
                icon: 'images/icons/tree.png',
                handler: function() {
                    grids.addEditorTab(this.text, this.icon, "entities");
                }
            },
            {
                text: 'Items Editor',
                icon: 'images/icons/ring.png',
                handler: function() {
                    grids.addEditorTab(this.text, this.icon, "items");
                }
            },
            {
                text: 'Shops Editor',
                icon: 'images/icons/coins.png'
            },
            {
                text: 'Quests Editor',
                disabled: true,
                icon: 'images/icons/bomb.png'
            }
        ];  */

    },

    createToolbar : function()
    {

        tools.gridsList = Ext.create('Ext.ButtonGroup',
        {
            title: 'Grids',
            columns: 1,
            collapsible: true,
            titleCollapse: true,
            defaults: {
                scale: 'large',
                width: 183,
                textAlign: 'left'
            }
        });

        tools.updateGridsList();

        this.toolbar = Ext.create('Ext.Panel',
        {
            region: "east",
            width: 200,
            //flex:1,
            minSize: 200,
            maxSize: 500,
            frame: true,
            disabled: true,

            items: [
                {
                    xtype: 'buttongroup',
                    title: 'Community',
                    columns: 1,
                    collapsible: true,
                    titleCollapse: true,
                    defaults: {
                        scale: 'large',
                        width: 183,
                        textAlign: 'left'
                    },
                    items: [
                        {
                            text: 'News Manager',
                            disabled: true,
                            icon: 'images/icons/pen.png'
                        },
                        {
                            text: 'Notifications Sender',
                            disabled: true,
                            icon: 'images/icons/message_out.png'
                        },
                        {
                            text: 'Users Manager',
                            icon: 'images/icons/users.png'
                        }
                    ]
                },
                {
                    xtype: 'buttongroup',
                    title: 'Statistics',
                    columns: 1,
                    collapsible: true,
                    titleCollapse: true,
                    defaults: {
                        scale: 'large',
                        width: 183,
                        textAlign: 'left'
                    },
                    items: [
                        {
                            text: 'Registrations',
                            disabled: true,
                            icon: 'images/icons/signal2.png'
                        },
                        {
                            text: 'Payments',
                            disabled: true,
                            icon: 'images/icons/credit_card.png'
                        },
                        {
                            text: 'Game Progress',
                            disabled: true,
                            icon: 'images/icons/energy.png'
                        }
                    ]
                },
                tools.gridsList
            ]
        });

    }

}

