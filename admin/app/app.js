
Ext.onReady(function()
{
    projects.init();
    tools.createToolbar();
    app.init();

});

/*
 * Main app singletone class
 */
var app =
{
    tabPanel: null,
    viewport: null,

    // Create objects
    init: function()
    {

        // Tab panel
        this.tabPanel = Ext.createWidget("tabpanel", {
            id: "appTabPanel",
            resizeTabs: true,
            enableTabScroll: true,
            plain: true,
            region: "center",
            layout: "card",
            maxTabWidth: 200,
            defaults: {
                autoScroll: true,
                bodyPadding: 5
            },

            items: [
                {
                    title: "Dashboard",
                    html: "Overall statistics and logs (coming soon)"
                }
            ]
        });

        // Main viewport
        this.viewport = Ext.create("Ext.Viewport", {
            layout: "border",
            title: "",
            items: [
            {
                xtype: "toolbar",
                id: "header",
                region: "north",

                items: [
                    {
                        xtype: 'image',
                        src: 'images/crown/logo.png',
                        //width: 100,
                        height: 50,
                        margins: "4 4 4 4"
                    },
                    '->',
                    {
                        xtype: "text",
                        //text: "Welcome, " + userName + "!"
                    },
                    {
                        xtype: 'button',
                        text: 'Users',
                        iconAlign: 'top',
                        icon: 'images/icons/user.png',
                        width: 70,
                        scale: 'large',
                        id: "usersButton",
                        handler: function()
                        {
                            users.edit.showWnd();
                        }
                    },
                    {
                        xtype: "button",
                        text: 'Logout',
                        iconAlign: 'top',
                        icon: 'images/icons/logout.png',
                        width: 70,
                        scale: "large",
                        handler: function() {
                            Ext.Msg.show({
                                title:'Logout',
                                msg:  'Do you really want to logout?',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function(btn)
                                {
                                    if(btn == "no") return;
                                    window.location.href = "?logout=true";
                                }
                            })
                        }
                    }
                ]
            },
            {
                id: "layout-browser",
                region: "west",
                title: "PROJECTS AND TOOLS",
                //layout: "fit",
                layout: "border",
                //layout: "anchor",
                collapsible: true,
                split:true,
                width: 500,
                minSize: 100,
                maxSize: 500,

                items: [
                    projects.tree,
                    tools.toolbar
                ]
            },
               this.tabPanel
            ],
            renderTo: Ext.getBody()
        });

        if(userRole != "Admin") Ext.getCmp('usersButton').hide();

    }

}
