function TreePanelState(mytree) {
    this.mytree = mytree;
    this.init();
}
TreePanelState.prototype.init = function() {

    this.cp = Ext.create('Ext.state.CookieProvider', {
        //path: "/cgi-bin/",
        expires: new Date(new Date().getTime()+(1000*60*60*24*30)), //30 days
        //domain: "sencha.com"
    });

    this.state = this.cp.get('TreePanelState_' + this.mytree.id, new Array() );

}
TreePanelState.prototype.saveState = function(newState) {
    this.state = newState;
    this.cp.set('TreePanelState_' + this.mytree.id, this.state);
}
TreePanelState.prototype.onExpand = function(node) {
    var currentPath = node.getPath();
    var newState = new Array();
    for (var i = 0; i < this.state.length; ++i) {
        var path = this.state[i];
        if (currentPath.indexOf(path) == -1) {
            // this path does not already exist
            newState.push(path);
        }
    }
    // now ad the new path
    newState.push(currentPath);
    this.saveState(newState);
}
TreePanelState.prototype.onCollapse = function(node){
    var closedPath = closedPath = node.getPath();
    var newState = new Array();
    for (var i = 0; i < this.state.length; ++i) {
        var path = this.state[i];
        if (path.indexOf(closedPath) == -1) {
            // this path is not a subpath of the closed path
            newState.push(path);
        }
    }
    if (newState.length == 0) {
        var parentNode = node.parentNode;
        newState.push((parentNode == null ? this.mytree.pathSeparator : parentNode.getPath()));
    }
    this.saveState(newState);
}
TreePanelState.prototype.restoreState = function(defaultPath) {
    if (this.state.length == 0) {
        var newState = new Array(defaultPath);
        this.saveState(newState);
        this.mytree.expandPath(defaultPath);
        return;
    }
    for (var i = 0; i < this.state.length; ++i) {
        // activate all path strings from the state
        try {
            var path = this.state[i];
            this.mytree.expandPath(path);
        } catch(e) {
            // ignore invalid path, seems to be remove in the datamodel
            // TODO fix state at this point
        }
    }
}