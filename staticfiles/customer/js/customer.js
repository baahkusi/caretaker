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
                                template:"Customers",
                                type:"header"
                            },
                            customer_list,
                            // {
                            //     id:"suppliers",
                            //     view:"tabview",
                            //     cells:[
                            //         customer_list,
                            //         customer_details
                            //     ]
                            // }
                        ]
                    }
                ]
            }
        ]
    });

    var selected_customer = null;

    webix.ui(customer_window);
    webix.ui(customer_detail_window);
    webix.ui(all_invoice_window);
    webix.ui(receive_payment_window);
    webix.i18n.setLocale("gh-GH");

});
