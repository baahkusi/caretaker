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
                                template:"<b>Receipts ~ For all cash transactions [ Instant Payments ]</b>",
                                type:"header"
                            },
                            receipts
                        ]
                    }
                ]
            }
        ]
    });

    webix.ui(all_receipt_window);

    webix.i18n.setLocale("gh-GH");

});
