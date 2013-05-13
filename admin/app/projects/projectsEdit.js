/*
 * Projects edit window
 */

projects.edit =
{
    
    wnd: null,
    formDB: null,
    formGrids: null,
    
    showWnd: function() {

        var node = projects.tree.getSelectionModel().getLastSelected();

        if(!node) return;

        this.createFormDB();
        this.createFormGrids();

        // Reset form and display window
        if(this.wnd)
        {
            this.wnd.down('form').getForm().reset();
            this.wnd.show();
        }
        // Create new window
        else this.wnd = Ext.create('Ext.window.Window', {

            title : 'Project Settings',
            layout: 'fit',
            closable: true,
            closeAction: 'hide',
            autoShow: true,
            modal: true,

            height: 400,
            width: 500,
            icon: 'images/icons/settings.png',

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

                defaultType: 'textfield',
                items: [
                {
                    name : 'name',
                    fieldLabel: 'Name'
                },
                {
                    name : 'icon',
                    fieldLabel: 'Icon'
                },
                {
                    fieldLabel: 'Platform',
                    name: 'platform'
                },
                {
                    fieldLabel: 'Plugins',
                    name: 'plugins'
                },
                {
                    xtype: 'tabpanel',
                    plain: true,
                    frame: false,
                    activeTab: 0,
                    flex: 1,

                    items:[
                        {

                            title: 'Login',
                            defaultType: 'textfield',

                            defaults: {
                                labelWidth: '10%',
                                width: '100%'
                            },

                            items: [
                                {
                                    fieldLabel: 'Server URL',
                                    name: 'serverURL'
                                },
                                {
                                    fieldLabel: 'Deploy key',
                                    name: 'deployKey'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Test Connection',
                                    handler: function()
                                    {
                                        // Get form values
                                        var values = projects.edit.wnd.down('form').getValues();
                                        CrownServer.ping(values['serverURL'], values['deployKey'], function(result)
                                        {
                                            if(result == true) {
                                                Ext.MessageBox.alert('Test connection is ok', "Connected successfully. Server is ready to use.");
                                            }
                                            else Ext.MessageBox.alert('Connection error', result);
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Maintenance',
                            defaultType: 'textfield',

                            defaults: {
                                labelWidth: '10%',
                                width: '100%'
                            },

                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    fieldLabel: 'Maintenance mode',
                                    name: 'maintenance',
                                    inputValue: true,
                                    uncheckedValue: false
                                },
                                {
                                    fieldLabel: 'Maintenance message',
                                    name: 'maintenanceMsg'
                                }
                            ]
                        },
                        {

                            title: 'Grids',
                            defaultType: 'textfield',

                            items: [
                                this.formGrids
                            ]
                        },
                        {
                            title: 'Databases',
                            items: [
                                this.formDB
                            ]
                        },
                        {
                            title:'Frontend',
                            defaultType: 'textfield',

                            defaults: {
                                labelWidth: '10%',
                                width: '100%'
                            },

                            items: [
                                {
                                    fieldLabel: 'Client URL',
                                    name: 'clientURL'
                                },
                                {
                                    fieldLabel: 'Grids URL',
                                    name : 'clientGridsURL'
                                },
                                {
                                    fieldLabel: 'Grids Deploy Key',
                                    name : 'clientGridsKey'
                                }
                            ]
                        }
                    ]
                } ]
            },

            buttons: [
                {
                    text: 'Save',
                    scale: "large",
                    handler: function()
                    {
                        // Get form values
                        var values = projects.edit.wnd.down('form').getValues();

                        // Append databases list to form value
                        values['dataServers'] = CrownUtils.gridToArray(projects.edit.formDB);
                        values['gridsList'] = CrownUtils.gridToArray(projects.edit.formGrids);

                        // Set new values to projects tree node
                        var node = projects.tree.getSelectionModel().getLastSelected();
                        node.set(values);

                        // Save projects tree config
                        var data = new Ext.tree.JsonTreeSerializer(projects.tree).toString();
                        CrownConfig.save("projects", data);

                        // Save to server
                        CrownServer.deploy(values['serverURL'], values['deployKey'], "project", "project", Ext.JSON.encode(values));

                        // Update server status
                        projects.updateStatus(node);

                        // Close window
                        projects.edit.wnd.close();
                    }
                },
                {
                    text: 'Cancel',
                    scale: "large",
                    handler: function() {
                        projects.edit.wnd.close();
                    }
                }
            ]
        });

        // Load fields
        projects.edit.wnd.down('form').loadRecord(node);
        // Load databases field
        this.formDB.getStore().loadData( node.get('dataServers') );
        this.formGrids.getStore().loadData( node.get('gridsList') );

    }
}
