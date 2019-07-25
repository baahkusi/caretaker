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
                        type:"space",
                        rows:[
                            {
                                template:"<b>Credit Point of Sales [ Payment Later ]</b>",
                                type:"header"
                            },
                            get_product,
                            pos_datatable,
                            pos_buttons,
                        ]
                    }
                ]
            }
        ]
    });

    // windows
    webix.ui(get_product_window);
    webix.ui(customer_window);

    // logic
    var list = $$("get_product").getPopup().getList();
    list.clearAll();
    list.load("/inventory/apiv1/helpers/getproductidface");
    $$("get_product").focus();
    var customer_list = $$("get_customer").getPopup().getList();
    customer_list.clearAll();
    customer_list.load("/customer/apiv1/helpers/getcustomeridface");

});
