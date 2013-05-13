/*
 * Configuration manager class
 */
var CrownConfig =
{
    getURL: function(filename)
    {
        var url = "config/?name=" + filename
        return url;
    },

    save: function(filename, data)
    {
        // Show wait message
        var box = Ext.MessageBox.wait('Please wait...', 'Save');

        // Save
        var url = "config/?name=" + filename;
        Ext.Ajax.request(
        {
            url: url,
            method: 'POST',
            params:
            {
                "data": data
            },

            success: function(response, opts) {
                box.hide();
            },
            failure: function(response, opts)
            {
                Ext.MessageBox.alert('Save error', "Can't save config.", response.status);
                box.hide();
            }
        });

    }

}