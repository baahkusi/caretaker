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
                                template:"Inventory / Stock Management",
                                type:"header"
                            },
                            {
                                id:"inventory",
                                view: "tabview",
                                cells: [
                                    product_category,
                                    product,
                                    inventory_history_dt,
                                    inventory_history
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    // windows
    webix.ui(product_category_window);
    webix.ui(product_window);
    webix.ui(product_quantity_window);
    //
    // webix.ui(product_quantity_window_inc);
    // webix.ui(product_quantity_window_dec);
    webix.ui(graph_window);
    webix.ui(inv_inc_wind);
    webix.ui(inv_dec_wind);
    webix.ui(inv_hist_wind);
    // webix.ui(hide_show_wind);
});
