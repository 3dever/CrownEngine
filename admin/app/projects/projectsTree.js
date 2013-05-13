
projects.createTree = function()
{
    // Create context menu
    var projectsContextMenu = Ext.create('Ext.menu.Menu', {
        items: projects.menu
    });

    // Create projects tree
    projects.tree = Ext.create('Ext.tree.Panel',
    {
        id : "projects.tree",
        region: 'west',
        //width: 200,
        flex:100,
        //activeItem: 0,

        rootVisible: false,
        hideHeaders: true,
        overflow: 'auto',
        hideCollapseTool: true,
        lines: false,

        store: this.store,
        columns: [
            {
                xtype: 'treecolumn',
                header: 'Name',
                dataIndex: 'name',
                flex: 3,
                sortable: false,
                editor: 'textfield'
            },
            {
                xtype: 'actioncolumn',
                header: 'Status',
                dataIndex: 'status',
                width: 50,
                sortable: false,
                align: 'center',
                renderer: function(value)
                {   if(value == "maintenance") {
                        return '<img src="images/icons/lock.png"/>';
                    }
                    if(value == "online") {
                        return '<img src="images/icons/signal.png"/>';
                    }
                    else if(value == "offline") {
                        return '<img src="images/icons/signal_off.png"/>';
                    }
                    return "";
                }
            }
        ],

        cls: 'treeLargeFont',

        // Add drag and drop
        viewConfig: {
            plugins: {
               ptype: 'treeviewdragdrop'
            },
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    projectsContextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },

        // Control
        listeners: {
            itemclick: function (record, item, index) {
                if(item.get('leaf') && item.get('status') != 'offline') tools.enable();
                else tools.disable();
            },
            itemdblclick: function (record, item, index) {
                 projects.edit.showWnd();
             }
        },

        // Add toolbar
        dockedItems:  [ {
            xtype: "toolbar",
            dock: 'bottom',
            //ui: 'footer',
            items: projects.menu
        }
        ]

    });
    //setInterval(function(){    }, 1000);
}
