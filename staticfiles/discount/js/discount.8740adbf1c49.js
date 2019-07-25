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
                                template:"Discount Management",
                                type:"header"
                            },
                            {
                                rows:[
                                    {
                                        template:"Discounts"
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
