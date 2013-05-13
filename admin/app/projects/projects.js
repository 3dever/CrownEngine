/*
 * Projects Tree and editor class
 */

var projects =
{
    tree: null,
    model: null,
    store: null,
    menu: null,

    // Constructor
    init: function()
    {
        this.createStore();
        this.createMenu();
        this.createTree();

    },

    // Update all projects status
    updateStatuses: function()
    {
        projects.tree.getRootNode().cascadeBy(function(node)
        {
            projects.updateStatus(node);
            return true;
        });
    },

    // Update status of single project by it's node
    updateStatus: function(node)
    {
        // Node is directory
        if(!node.get('leaf')) return;

        // Project not configurated
        if(node.get('serverURL') == '' || node.get('deployKey') == '') {
            node.set('status', 'offline');
            return;
        }

        // Ping
        CrownServer.ping(node.get('serverURL'), node.get('deployKey'), function(result)
        {
            // Set status
            if(result == 'Maintenance') node.set('status', 'maintenance');
            // Set online
            else if(result == true) node.set('status', 'online');
            // Set offline
            else node.set('status', 'offline');
            node.commit();

        });
    }

}
