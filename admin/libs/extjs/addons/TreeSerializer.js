/**
 * @class Ext.tree.TreeSerializer
 * A base class for implementations which provide serialization of an
 * {@link Ext.tree.TreePanel}.
 * <p>
 * Implementations must provide a toString method which returns the serialized
 * representation of the tree.
 *
 * @constructor
 * @param {TreePanel} tree
 * @param (filters) array
 * @param {Object} config
 */
Ext.tree.TreeSerializer = Ext.extend(Object, {

    constructor: function(tree, filters, config)
    {
        if(filters == null) filters = ["hrefTarget", "allowDrag", "expanded"];

        if (typeof this.toString !== 'function') {
            throw 'Ext.tree.TreeSerializer implementation does not implement toString()';
        }

        this.tree = tree;
        this.filters = filters;

        if(this.filters == null) this.filters = this.standardAttributes;
        if (this.attributeFilter) {
            this.attributeFilter = this.attributeFilter.createInterceptor(this.defaultAttributeFilter);
        } else {
            this.attributeFilter = this.defaultAttributeFilter;
        }
        if (this.nodeFilter) {
            this.nodeFilter = this.nodeFilter.createInterceptor(this.defaultNodeFilter);
        } else {
            this.nodeFilter = this.defaultNodeFilter;
        }
        Ext.apply(this, config);
    },

    /*
     * @cfg nodeFilter {Function} (optional) A function, which when passed the node, returns true or false to include
     * or exclude the node.
     */
    /*
     * @cfg attributeFilter {Function} (optional) A function, which when passed an attribute name, and an attribute value,
     * returns true or false to include or exclude the attribute.
     */
    /*
     * @cfg attributeMap {Array} (Optional) An object hash mapping Node attribute names to XML attribute names, or JSON property names.
     */

    /* @private
     * Array of node attributes to ignore.
     */
    standardAttributes: [],
    /*"id","parentId","index","checked","root",
        "isFirst","isLast","depth","loaded","loading","qtitle","expandable",
        "nodeType", "allowDrag", "allowDrop", "disabled", "icon", "events", "children",
        "cls", "iconCls", "href", "hrefTarget", "qtip", "singleClickExpand", "uiProvider", "loader"],*/


    /** @private
     * Default attribute filter.
     * Rejects functions and standard attributes.
     */
    defaultAttributeFilter: function(attName, attValue)
    {
        var valid = true;

        if (typeof attValue == 'function') valid = false;
        if (this.filters.indexOf(attName) != -1) valid = false;

        if(attName == "id" && attValue.indexOf("ext-record") != -1) valid = false;
        else if(attName == "parentId" && attValue == null) valid = false;
        //else if(attName == "index" && attValue == 0) valid = false;
        else if(attName == "expanded" && attValue == false) valid = false;
        else if(attName == "expandable" && attValue == true) valid = false;
        //else if(attName == "leaf" && attValue == false) valid = false;
        else if(attName == "checked" && attValue == null) valid = false;
        else if(attName == "cls" && attValue == "") valid = false;
        else if(attName == "iconCls" && attValue == "") valid = false;
        else if(attName == "icon" && attValue == "") valid = false;
        else if(attName == "allowDrop" && attValue == true) valid = false;
        else if(attName == "allowDrag" && attValue == false) valid = false;
        //else if(attName == "loaded" && attValue == true) valid = false;
        else if(attName == "loading" && attValue == false) valid = false;
        else if(attName == "qtip" && attValue == "") valid = false;
        else if(attName == "qtitle" && attValue == "") valid = false;
        else if(attName == "href" && attValue == "") valid = false;


        return valid;
    },

    /** @private
     * Default node filter.
     * Accepts all nodes.
     */
    defaultNodeFilter: function(node) {
        return true;
    }
});

/**
 * @class Ext.tree.XmlTreeSerializer
 * An implementation of Ext.tree.TreeSerializer which serializes an
 * {@link Ext.tree.TreePanel} to an XML string.
 */
Ext.tree.XmlTreeSerializer = Ext.extend(Ext.tree.TreeSerializer, {
    /**
     * Returns a string of XML that represents the tree
     * @return {String}
     */
    toString: function(nodeFilter, attributeFilter){
        return '\u003C?xml version="1.0"?>\u003Ctree>' +
            this.nodeToString(this.tree.getRootNode()) + '\u003C/tree>';
    },

    /**
     * Returns a string of XML that represents the node
     * @param {Object} node The node to serialize
     * @return {String}
     */
    nodeToString: function(node){
        if (!this.nodeFilter(node)) {
            return '';
        }
        var result = '\u003Cnode';
        if (this.attributeFilter("id", node.id)) {
            result += ' id="' + node.id + '"';
        }

//      Add all user-added attributes unless rejected by the attributeFilter.
        for(var key in node.data) {
            if (this.attributeFilter(key, node.data[key])) {
                if (key != 'id') {
                    result += ' ' + (this.attributeMap ? (this.attributeMap[key] || key) : key) + '="' + node.data[key] + '"';
                }
            }
        }

//      Add child nodes if any
        var children = node.childNodes;
        var clen = children.length;
        if(clen == 0){
            result += '/>';
        }else{
            result += '>';
            for(var i = 0; i < clen; i++){
                result += this.nodeToString(children[i]);
            }
            result += '\u003C/node>';
        }
        return result;
    }
});

/**
 * @class Ext.tree.JsonTreeSerializer
 * An implementation of Ext.tree.TreeSerializer which serializes an
 * {@link Ext.tree.TreePanel} to a Json string.
 */
Ext.tree.JsonTreeSerializer = Ext.extend(Ext.tree.TreeSerializer, {
    /**
     * Returns a string of Json that represents the tree
     * @return {String}
     */
    toString: function(){
        return this.nodeToString(this.tree.getRootNode());
    },

    /**
     * Returns a string of Json that represents the node
     * @param {Object} node The node to serialize
     */
    nodeToString: function(node)
    {
        // Exclude nodes based on caller-supplied filtering function
        if (!this.nodeFilter(node)) {
            return '';
        }

        var result = "{ ",
            key,
            children = node.childNodes,
            clen = children.length, i;

        if (this.attributeFilter("id", node.id)) {
            result += '"id":"' + node.id + '",';
        }

        // Add all user-added attributes unless rejected by the attributeFilter.
        for(key in node.data) {
            var keyValue = node.data[key];
            if (this.attributeFilter(key, keyValue)) {
                if(!clen && key == 'children' && (keyValue == null || keyValue == '' || keyValue == []) ) keyValue = '[]';
                else keyValue = Ext.encode(keyValue);
                result += '"' + (this.attributeMap ? (this.attributeMap[key] || key) : key) + '":' + keyValue + ',';
            }
        }

        // Add child nodes if any
        if(clen){
            result += '"children":['
            for(i = 0; i < clen; i++){
                result += this.nodeToString(children[i]) + ',';
            }
            result = result.substr(0, result.length - 1) + ']';
        }
        else {
            result = result.substr(0, result.length - 1);
        }
        return result + "}";
    }
});
