webix.ready(function(){
    // layout
    webix.ui({

        rows:[
           toolbar,
           {
                cols:[
                    side,
                    {
                        type:"space",
                        rows:[
                            {
                                template:"<b>Application Settings</b>",
                                type:"header",
                            },
                            {
                                template:'Settings'
                            }
                        ]

                    }
                ]
            }
        ]
    });

    // windows



    webix.i18n.setLocale("gh-GH");
});
