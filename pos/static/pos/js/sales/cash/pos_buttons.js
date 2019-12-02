function save_cash_sales(print_receipt){
    $$("save_only").disable();
    // $$("save_and_print").disable();
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
        // $$("save_and_print").enable();
        $$("clear_sales").enable();
        $$("put_sales_on_hold").enable();
    }else {
        payment_system_id = $$('get_payment_system').getValue();

        if (!payment_system_id) {
            webix.message("Select a Payment System");
            $$('get_payment_system').focus();
            $$("save_only").enable();
            // $$("save_and_print").enable();
            $$("clear_sales").enable();
            $$("put_sales_on_hold").enable();
        }else{
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
        payment_system = $$('get_payment_system').getPopup().getList().getItem(payment_system_id);
        // customer = $$("get_customer").getValue();
        final_data['sales'] = sales;
        // final_data['customer_name'] = customer;
        final_data['print_receipt'] = print_receipt;
        final_data['cash'] = payment_system['id'];
        final_data['system'] = payment_system['system'];
        final_data['currency'] = payment_system['currency'];
        receipt_promise = sales.length;
        // First create a receipt
        url = "/receipt/apiv1/create/salesreceipt";
        rand = Math.floor(Math.random() * (999 - 99 + 1)) + 99;
        console.log(rand);
        receipt_number = "SR"+rand;
        receipt_data = {
            number:receipt_number,
            cash:payment_system['id'],
            system:payment_system['system'],
            currency:payment_system['currency'],
            customer_name:'customer'
        }
        webix.ajax().post(url,receipt_data,function(txt,resp){

            msg = resp.json();
            console.log(msg);
            if (msg.status) {
                final_data['receipt'] = msg.object.id;
                final_data['receipt_number'] = msg.object.number;
                final_data['receipt_time'] = msg.object.timestamp;
                url = "/pos/apiv1/create/cashsale";
                console.log(final_data);
                webix.ajax().post(url,final_data,function(txt,resp){
                    msg = resp.json();
                    console.log(msg);
                    if (msg.status){
                        webix.message(msg.msg);
                        $$("pos_datatable").clearAll();
                        $$("get_product").focus();
                        // $$("get_customer").setValue("");
                        $$("save_only").enable();
                        // $$("save_and_print").enable();
                        $$("clear_sales").enable();
                        $$("put_sales_on_hold").enable();
                    }else{
                        webix.message(msg.msg,'error');
                        $$("save_only").enable();
                        // $$("save_and_print").enable();
                        $$("clear_sales").enable();
                        $$("put_sales_on_hold").enable();
                    }
                });
            }else{
                webix.message("I couldn't create a receipt, for some reason please refresh and make sure that all the relevant data is provided.",'error');
                $$("save_only").enable();
                // $$("save_and_print").enable();
                $$("clear_sales").enable();
                $$("put_sales_on_hold").enable();
            }
        }).fail(function(){
            webix.message("Some error occurred retry and if it persists, refresh the page","error");
            $$("save_only").enable();
            // $$("save_and_print").enable();
            $$("clear_sales").enable();
            $$("put_sales_on_hold").enable();
        });
    }
}
}

function clear(){
    $$("pos_datatable").clearAll();
    $$("get_product").focus();
    $$("get_product").setValue("");
}

function put_sales_on_hold(){
    
    data = $$("pos_datatable").serialize();
    
    if (data.length===0) {
        webix.message("No entry made yet","error");
    }else {
        webix.message('Putting order '+ order_count +' on hold', "debug");
        payment = $$('get_payment_system').getValue();
        // customer = $$("get_customer").getValue();
        // $$("get_customer").setValue("");
        info = {
            id:order_count,
            value:"Order "+order_count,
            data:data,
            payment:payment,
            // customer:customer
        }
        $$('get_on_hold').getPopup().getList().add(info);
        order_count++;
        clear();
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
                clear();
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
                put_sales_on_hold();
            }
        },
        {},
        {
            id:"save_only",
            view:"button",
            label:"Save",
            type:"iconButton",
            icon:"save",
            autowidth:true,
            click:function () {
                save_cash_sales(false);
            }
        }

    ]
}
