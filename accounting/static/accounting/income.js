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
                                template:"<b>Income Statement Report</b>",
                                type:"header",
                            },
                            {
                                template:'Income'
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
