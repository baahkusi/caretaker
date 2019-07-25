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
                                template:"Invoices",
                                type:"header"
                            },
                            invoices
                        ]
                    }
                ]
            }
        ]
    });

    webix.ui(all_invoice_window);
    webix.ui(make_payment_window);
    webix.ui(receive_payment_window);
    webix.i18n.setLocale("gh-GH");

});
