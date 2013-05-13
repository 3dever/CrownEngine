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
Ext.grid.GridSerializer = Ext.extend(Object, {
    
    constructor: function(grid, filters, config)
    {
        if (typeof this.toString !== 'function') {
            throw 'Ext.grid.GridSerializer implementation does not implement toString()';
        }

        this.grid = grid;
        this.filters = filters;

        if(this.filters == null) this.filters = this.standardAttributes;
        if (this.attributeFilter) {
            this.attributeFilter = this.attributeFilter.createInterceptor(this.defaultAttributeFilter);
        } else {
            this.attributeFilter = this.defaultAttributeFilter;
        }
        if (this.rowFilter) {
            this.rowFilter = this.rowFilter.createInterceptor(this.defaultRowFilter);
        } else {
            this.rowFilter = this.defaultRowFilter;
        }
        Ext.apply(this, config);
    },

    /* @private
     * Array of row attributes to ignore.
     */
    standardAttributes: [],

    /** @private
     * Default attribute filter.
     * Rejects functions and standard attributes.
     */
    defaultAttributeFilter: function(attName, attValue)
    {
        var valid = true;

        if (typeof attValue == 'function') valid = false;
        if (this.filters.indexOf(attName) != -1) valid = false;

        //if(attName == "id" && attValue.indexOf("ext-record") != -1) valid = false;

        return valid;
    },

    /** @private
     * Default row filter.
     * Accepts all rows.
     */
    defaultRowFilter: function(row) {
        return true;
    }
});

/**
 * @class Ext.tree.JsonTreeSerializer
 * An implementation of Ext.tree.TreeSerializer which serializes an
 * {@link Ext.tree.TreePanel} to a Json string.
 */
Ext.grid.JsonGridSerializer = Ext.extend(Ext.grid.GridSerializer, {
    /**
     * Returns a string of Json that represents the tree
     * @return {String}
     */
    toString: function(){
        return this.rowToString(this.grid.getRootRow());
    },

    /**
     * Returns a string of Json that represents the row
     * @param {Object} row The row to serialize
     */
    rowToString: function(row)
    {
        // Exclude rows based on caller-supplied filtering function
        if (!this.rowFilter(row)) {
            return '';
        }

        var result = "{ ",
            key,
            children = row.childRows,
            clen = children.length, i;

        if (this.attributeFilter("id", row.id)) {
            result += '"id":"' + row.id + '",';
        }

        // Add all user-added attributes unless rejected by the attributeFilter.
        for(key in row.data) {
            var keyValue = row.data[key];
            if (this.attributeFilter(key, keyValue)) {
                if(!clen && key == 'children' && (keyValue == null || keyValue == '') ) keyValue = '[]';
                else keyValue = Ext.encode(keyValue);
                result += '"' + (this.attributeMap ? (this.attributeMap[key] || key) : key) + '":' + keyValue + ',';
            }
        }

        // Add child rows if any
        if(clen){
            result += '"children":['
            for(i = 0; i < clen; i++){
                result += this.rowToString(children[i]) + ',';
            }
            result = result.substr(0, result.length - 1) + ']';
        }
        else {
            result = result.substr(0, result.length - 1);
        }
        return result + "}";
    }
});
