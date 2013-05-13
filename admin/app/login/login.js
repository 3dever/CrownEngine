
// TODO: tabs drag & drop, hints, andti-double tab

Ext.onReady(function() {

    var loginForm = new Ext.FormPanel(
    {
        url:'index.php',
        region:"center",
        frame:true,
        defaultType:'textfield',
        monitorValid:true,
        title:"Please login",

        // Specific attributes for the text fields.
        items:[
            {
                fieldLabel:'Username',
                name:'userName',
                allowBlank:false,
                anchor:'100%'
            },
            {
                fieldLabel:'Password',
                name:'userPassword',
                inputType:'password',
                allowBlank:false,
                anchor:'100%'
            },
            {
                fieldLabel:'Remember me',
                name:'rememberMe',
                xtype:'checkbox',
                inputValue:'1'

            }
        ],

        // All the magic happens after the user clicks the button
        buttons:[
            {
                text:'Login now',
                width:365,
                scale:"large",
                formBind:true,
                id: 'submitButton',
                type: 'submit',

                // Function that fires when user clicks the button
                handler: function() {
                    loginForm.getForm().submit(
                    {
                        method:'POST',
                        waitTitle:'Connecting',
                        waitMsg:'Sending data...',

                        // Success
                        success:function () {
                            var redirect = './';
                            window.location = redirect;
                        },

                        // Failure
                        failure:function (form, action)
                        {
                            if (action.failureType == 'server') {
                                obj = Ext.JSON.decode(action.response.responseText);
                                Ext.Msg.alert('Login Failed!', obj.errors.reason);
                            }
                            else {
                                Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText);
                            }
                        }
                    });
                }
            }
        ]

    });


    // Display login window
    var win = new Ext.Window(
        {
            layout:"anchor",
            icon: "images/crown/icon.png",
            title:"Crown Admin",
            width: 400,
            //height:190,
            //draggable: false,
            closable:false,
            resizable:false,
            plain:true,
            border:false,
            //header: false,
            align:"center",

            items:[
                loginForm
            ]
        });

    win.show();

    // Main viewport
    Ext.create("Ext.Viewport", {
        layout:"border",
        items:[],
        renderTo:Ext.getBody()
    });

});

