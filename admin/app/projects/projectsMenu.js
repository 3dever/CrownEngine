/*
 * Projects Menu and handlers
 */

projects.createMenu = function()
{
    projects.menu= [];

    // Don't create projects menu, if not admin mode
    if(userRole != "Admin") return;

    // Define projects menu
    projects.menu = [
        {
            text:'Add',
            icon: 'images/icons/file.png',
            scale: "large",
            menu: {
                items: [
                    {
                        text:'New Folder',
                        icon: 'images/icons/folder.png',
                        scale: "large",
                        handler: onMenuClick
                    },
                    {
                        text:'New Project',
                        icon: 'images/icons/file.png',
                        scale: "large",
                        handler: onMenuClick
                    }
                ]
            }
        },
        {
            text: 'Settings',
            icon: 'images/icons/settings.png',
            scale: "large",
            handler: onMenuClick
        },
        {
            text: 'Remove',
            icon: 'images/icons/trash.png',
            scale: "large",
            handler: onMenuClick
        }
    ]

    // Projects toolbar menu events
    function onMenuClick(item)
    {
        var root = projects.tree.getRootNode();
        var parent = projects.tree.getSelectionModel().getLastSelected();
        if(!parent || parent.data['leaf'] == true) parent = root;

        // Add new directory
        if(item.text == "New Folder") {
            var node = parent.appendChild({
                name: 'Projects Group',
                icon: 'images/icons/folder.png',
                leaf: false,
                loaded: true,
                //expanded: true,
                children: []
            });
            //node.expand();
        }

        // Add new node
        if(item.text == "New Project") {
            var node = parent.appendChild({
                name: 'Project',
                icon: 'images/icons/file.png',
                leaf: true,
                children: null
            });
        }

        // Display projects edit window
        if(item.text == "Settings")
        {
            projects.edit.showWnd();
        }

        // Remove selectednodes from project
        if(item.text == "Remove")
        {
            var node = projects.tree.getSelectionModel().getLastSelected();
            var parent = node.parentNode;

            Ext.Msg.show({
                title:'Remove project',
                msg:  'Do you really want to remove project ' + node.data.name + '?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn)
                {
                    if(btn == "no") return;
                    // Remove list of nodes
                    if(parent) {
                        parent.removeChild(node);
                        if(parent.childNodes == 0) {
                            parent.data['children'] = null;
                        }
                    }
                    // Remove one node
                    else node.remove();
                    projects.save();
                }
            })
        }
    }
}
