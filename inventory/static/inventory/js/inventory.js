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

    var powerview = $$("powerview").getPopup().getList();
    powerview.clearAll();
    powerview.load("/inventory/apiv1/helpers/getproductidface");

    var today = new Date();
    $$("from_date").setValue(today);
    $$("from_date_dt").setValue(today);
    var from = today.toISOString().split("T")[0];
    today.setDate(today.getDate()+1);
    $$("to_date").setValue(today);
    $$("to_date_dt").setValue(today);
    var to = today.toISOString().split("T")[0];
    var dat = {b:from,e:to,p:"all"};
    var url = "/inventory/apiv1/helpers/track";
    webix.ajax().get(url,dat,function(txt,resp){
        data = resp.json();
        if (data.status) {
            doAll(data);
        }
    });

    var ur = "/inventory/apiv1/helpers/track/summary";
    $$('idthistory_datatable').showOverlay("<b>Loading data ...</b>");
    webix.ajax().get(ur,dat,function(txt,resp){
        data = resp.json();
        $$('idthistory_datatable').hideOverlay();
        if (data.status) {
            doAllDt(data);
        }
    });
});
