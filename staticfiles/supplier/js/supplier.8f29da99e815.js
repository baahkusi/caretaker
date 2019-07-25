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
                                template:"Suppliers",
                                type:"header"
                            },
                            supplier_list,
                            // {
                            //     id:"suppliers",
                            //     view:"tabview",
                            //     cells:[
                            //         supplier_list,
                            //         supplier_details
                            //     ]
                            // }
                        ]
                    }
                ]
            }
        ]
    });

    var selected_supplier = null;

    webix.ui(supplier_window);
    webix.ui(supplier_detail_window);
    webix.ui(all_invoice_window);
    webix.ui(make_payment_window);
    webix.i18n.setLocale("gh-GH");

});
