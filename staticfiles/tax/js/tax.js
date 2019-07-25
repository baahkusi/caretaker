webix.ready(function(){
    // layout
    webix.ui({
        // type:"wide",
        rows:[
           toolbar,
            {
                cols:[
                    side,
                    {
                        paddingX:10,
                        type:"space",
                        rows:[
                            {
                                template:"Tax Management",
                                type:"header"
                            },
                            {
                                rows:[
                                    {
                                        template:"Taxes"
                                    }
                                ]

                            }
                        ]
                    }
                ]
            }
        ]
    });

    webix.i18n.setLocale("gh-GH");

});
