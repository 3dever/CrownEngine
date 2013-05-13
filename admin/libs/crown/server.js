/*
 * Projects Tree and editor class
 */

var ADMIN_MODE = true;

var CrownServer =
{
    // Ping server
    ping: function(serverURL, deployKey, callback)
    {
        Ext.Ajax.request(
        {
            url: serverURL + "config/",
            method: 'POST',

            params: {
                "key": deployKey,
                "ping": true
            },

            success: function(response, opts)
            {
                var result = Ext.JSON.decode(response.responseText);
                if (result.success) callback(true);
                else callback(result.errors.reason);
            },

            failure: function(response, opts)
            {
                /*  var obj = Ext.JSON.decode(response.responseText);
                 var error =  obj.errors.reason;
                 */
                callback("Server is unavailable. Try to check out the slash at the end of URL.");
            }

        });
    },

    // Save config to server
    deploy: function(serverURL, deployKey, type, name, data)
    {
        Ext.Ajax.request(
        {
            url: serverURL + "config/?type=" + type + "&name=" + name,
            method: 'POST',
            params: {
                "key": deployKey,
                "data": data
            },

            success: function(response, opts) {

            },

            failure: function(response, opts)
            {
                Ext.MessageBox.alert('Save error', "Can't save config to server " + serverURL, response.status);
            }

        });
    }


}
