/*
 * Projects Model and Store
 */

projects.createStore = function()
{
    // Define model
    projects.model = Ext.define('ProjectsModel', {
        extend: 'Ext.data.Model',
        //idgen: 'sequential',

        fields: [

            { name: 'expanded', type: 'bool', defaultValue: 'true', persist: true },
            { name: 'children', defaultValue: null, persist: true},
            { name: 'loaded', defaultValue: null, persist: true},
            { name: 'hrefTarget', type: 'string', defaultValue: '_blank', persist: true },

            { name: 'name', type: 'string' },
            { name: 'icon', type: 'string', defaultValue: 'images/icons/file.png', persist: true },

            { name: 'clientURL', type: 'string', defaultValue: '' },
            { name: 'clientGridsURL', type: 'string', defaultValue: '' },
            { name: 'clientGridsKey', type: 'string', defaultValue: '' },

            { name: 'serverURL', type: 'string', defaultValue: '' },
            { name: 'deployKey', type: 'string', defaultValue: '' },
            { name: 'platform', type: 'string', defaultValue: ''},
            { name: 'plugins', type: 'string', defaultValue: ''},
            { name: 'gridsList', type: 'array', defaultValue: ''},

            { name: 'maintenance', type: 'bool', defaultValue: false},
            { name: 'maintenanceMsg', type: 'string', defaultValue: ''},

            { name: 'dataServers', type: 'array' },
            { name: 'status', type: 'string', defaultValue: "", persist: true}

        ],
        validations: [
            {type: 'presence', name: 'name'}
        ]
    });

    // Create store
    projects.store = Ext.create('Ext.data.TreeStore',
    {
        model: projects.model,
        autoLoad: true,

        root: {
            name: 'Projects',
            expanded: true
        },

        proxy: {
            type: 'ajax',
            url: CrownConfig.getURL("projects")
        },

        listeners: {
            load: function() {
                projects.updateStatuses();
            }
        }

    });
}
