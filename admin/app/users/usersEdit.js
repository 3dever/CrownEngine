/*
 * Projects edit window
 */

users.edit =
{

    wnd: null,
    formDB: null,

    showWnd: function() {

        this.createFormDB();

        // Reset form and display window
        if(this.wnd)
        {
            this.wnd.down('form').getForm().reset();
            this.wnd.show();
        }
        // Create new window
        else this.wnd = Ext.create('Ext.window.Window', {

            title : 'Users Edit',
            layout: 'fit',
            closable: true,
            closeAction: 'hide',
            autoShow: true,
            modal: true,

            height: 400,
            width: 500,
            icon: 'images/icons/user.png',

            items:
            {
                xtype: 'form',
                frame: true,
                plain: true,
                autoHeight: true,

                defaults: {
                    labelWidth: '10%',
                    width: '100%',
                    bodyPadding: 10
                },

                items: [
                    this.formDB
                ]
            },

            buttons: [
                {
                    text: 'Save',
                    scale: "large",
                    handler: function() {
                        // Save all projects
                        var dbArray = CrownUtils.gridToArray(users.edit.formDB);
                        CrownConfig.save("users", Ext.JSON.encode(dbArray));
                        // Close window
                        users.edit.wnd.close();
                    }
                },
                {
                    text: 'Cancel',
                    scale: "large",
                    handler: function() {
                        users.edit.wnd.close();
                    }
                }
            ]
        });

        // Load databases field
        //this.formDB.getStore().loadData( node.get('databases') );
        users.edit.formDB.getStore().load();

    }
}
