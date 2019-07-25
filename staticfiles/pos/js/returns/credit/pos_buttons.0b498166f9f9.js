function save_cash_sales(print_invoice){
    $$("save_only").disable();
    $$("save_and_print").disable();
    $$("clear_sales").disable();
    $$("put_sales_on_hold").disable();
    data = $$("pos_datatable").serialize();
    var final_data = {};
    var sales_returns = [];
    /*this is the sales data we would pass to the server
    customer,employee,product,quantity,sp,cp,product_name,amount,
    cash system, currency,is_base,rate
    */
    if (data.length===0) {
        webix.message("Nothing to save","error");
        $$("load_invoice").focus();
        $$("save_only").enable();
        $$("save_and_print").enable();
        $$("clear_sales").enable();
        $$("put_sales_on_hold").enable();
    }else {
        webix.message("Prepare data to be saved");
        l = 0;
        for (var i = 0; i < data.length; i++) {
            j = i-l;
            while (parseInt(data[i].quantity)==0) {
                l++;
                i++;
                if (i == data.length) {
                    break;
                }
            }
            if (i == data.length) {
                break;
            }else{
                sales_returns[j] = {
                    product:data[i].product_id,
                    quantity:data[i].quantity,
                    sp:data[i].sp,
                    cp:data[i].cp,
                    product_name:data[i].product_name,
                };
                var customer = data[i].customer;
                var customer_name = data[i].customer_name;
            }
        }
        // console.log(JSON.stringify(sales));

        final_data['sales_returns'] = sales_returns;
        final_data['print_invoice'] = print_invoice;
        console.log(final_data);
            invoice_promise = sales_returns.length;
            // First create a invoice
            url = "/invoice/apiv1/create/salesreturninvoice";
            rand = Math.floor(Math.random() * (9999 - 99 + 1)) + 99;
            // console.log(rand);
            invoice_number = "CN"+rand;
            invoice_data = {
                number:invoice_number,
                sales_invoice:$$("invoice_id").getValue(),
                customer:customer,
                customer_name:customer_name,
            }
            webix.ajax().post(url,invoice_data,function(txt,resp){

                msg = resp.json();
                console.log(msg);
                if (msg.status) {
                    final_data['invoice'] = msg.object.id;
                    final_data['invoice_number'] = msg.object.number;
                    final_data['invoice_time'] = msg.object.timestamp;
                    final_data['customer'] = customer;
                    final_data['customer_name'] = customer_name;
                    url = "/pos/apiv1/create/creditsalesreturn";
                    console.log(final_data);
                    webix.ajax().post(url,final_data,function(txt,resp){
                        msg = resp.json();
                        console.log(msg);
                        if (msg.status){
                            webix.message(msg.msg);
                            $$("pos_datatable").clearAll();
                            $$("load_invoice").focus();
                            $$("save_only").enable();
                            $$("save_and_print").enable();
                            $$("clear_sales").enable();
                            $$("put_sales_on_hold").enable();
                        }else{
                            webix.message(msg.msg,'error');
                            $$("save_only").enable();
                            $$("save_and_print").enable();
                            $$("clear_sales").enable();
                            $$("put_sales_on_hold").enable();
                        }
                    }).fail(function(){
                        webix.message("Action failed, something has definitely gone wrong. Refresh and try again or call SBK","error");
                    });
                }else{
                    webix.message("I couldn't create a invoice, for some reason please refresh and make sure that all the relevant data is provided.",'error');
                    $$("save_only").enable();
                    $$("save_and_print").enable();
                    $$("clear_sales").enable();
                    $$("put_sales_on_hold").enable();
                }
            }).fail(function(){
                webix.message("This invoice has been already been returned. You Can't return a invoice twice.","error");
                $$("save_only").enable();
                $$("save_and_print").enable();
                $$("clear_sales").enable();
                $$("put_sales_on_hold").enable();
            });
        }
}

var pos_buttons = {
    padding:30,
    cols:[
        {
            id:"clear_sales",
            view:"button",
            label:"Clear",
            type:"iconButton",
            icon:"times",
            autowidth:true,
            click:function () {
                $$("pos_datatable").clearAll();
                $$("load_invoice").focus();
                $$("load_invoice").setValue("") ;
            }
        },
        {
            id:"put_sales_on_hold",
            view:"button",
            label:"Put on hold",
            type:"iconButton",
            icon:"external-link",
            autowidth:true,
            click:function () {
                webix.message("Put current sales on hold and process another one with intention to come back to it");
            }
        },
        {},
        {
            id:"save_and_print",
            view:"button",
            label:"Save & Print",
            type:"iconButton",
            icon:"print",
            autowidth:true,
            click:function () {
                webix.message("Save sales and print invoice");
                save_cash_sales(true);
            }
        },
        {
            id:"save_only",
            view:"button",
            label:"Save only",
            type:"iconButton",
            icon:"save",
            autowidth:true,
            click:function () {
                save_cash_sales(false);
            }
        }

    ]
}
