function save_credit_sales(print_invoice){
    $$("save_only").disable();
    $$("save_and_print").disable();
    $$("clear_sales").disable();
    $$("put_sales_on_hold").disable();
    data = $$("pos_datatable").serialize();
    var final_data = {};
    var sales = [];
    /*this is the sales data we would pass to the server
    customer,employee,product,quantity,sp,cp,product_name,amount,
    cash system, currency,is_base,rate
    */
    if (data.length===0) {
        webix.message("Nothing to save","error");
        $$("get_product").focus();
        $$("save_only").enable();
        $$("save_and_print").enable();
        $$("clear_sales").enable();
        $$("put_sales_on_hold").enable();
    }else {
        webix.message("Prepare data to be saved");
        for (var i = 0; i < data.length; i++) {
            sales[i] = {
                product:data[i].id,
                quantity:data[i].order_qty,
                sp:data[i].sp,
                cp:data[i].cp,
                product_name:data[i].name,
            };
        }
        // console.log(JSON.stringify(sales));
        customer = $$("get_customer").getValue();
        if (customer) {
            webix.message("customer");
            customer_name = $$("get_customer").getPopup().getList().getItem(customer).value;
            final_data['sales'] = sales;
            final_data['customer'] = customer;
            final_data['customer_name'] = customer_name;
            final_data['print_invoice'] = print_invoice;
            invoice_promise = sales.length;
            // First create a receipt
            url = "/invoice/apiv1/create/salesinvoice";
            rand = Math.floor(Math.random() * (9999 - 99 + 1)) + 99;
            console.log(rand);
            invoice_number = "SI"+rand;
            invoice_data = {
                number:invoice_number,
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
                    url = "/pos/apiv1/create/creditsale";
                    console.log(final_data);
                    webix.ajax().post(url,final_data,function(txt,resp){
                        msg = resp.json();
                        console.log(msg);
                        if (msg.status){
                            webix.message(msg.msg);
                            $$("pos_datatable").clearAll();
                            $$("get_product").focus();
                            $$("get_customer").setValue("");
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
                    });
                }else{
                        webix.message("I couldn't create an invoice, for some reason please refresh and make sure that all the relevant data is provided.",'error');
                        $$("save_only").enable();
                        $$("save_and_print").enable();
                        $$("clear_sales").enable();
                        $$("put_sales_on_hold").enable();
                }

            });
        }else{
            webix.message("This is a credit sale, you need to identify the customer to whom you are making the sales so that i can track them for you.");
            $$("get_customer").focus();
            $$("save_only").enable();
            $$("save_and_print").enable();
            $$("clear_sales").enable();
            $$("put_sales_on_hold").enable();
        }
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
                $$("get_product").focus();
                $$("get_customer").setValue("");
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
                webix.message("Save sales and print receipt");
                save_credit_sales(true);
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
                save_credit_sales(false);
            }
        }

    ]
}
