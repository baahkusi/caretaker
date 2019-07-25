function save_cash_purchases(print_receipt){
    $$("save_only").disable();
    $$("save_and_print").disable();
    $$("clear_purchases").disable();
    $$("put_purchases_on_hold").disable();
    data = $$("pop_datatable").serialize();
    var final_data = {};
    var purchases_returns = [];
    /*this is the purchases data we would pass to the server
    customer,employee,product,quantity,sp,cp,product_name,amount,
    cash system, currency,is_base,rate
    */
    if (data.length===0) {
        webix.message("Nothing to save","error");
        $$("load_receipt").focus();
        $$("save_only").enable();
        $$("save_and_print").enable();
        $$("clear_purchases").enable();
        $$("put_purchases_on_hold").enable();
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
                purchases_returns[j] = {
                    product:data[i].product_id,
                    quantity:data[i].quantity,
                    sp:data[i].sp,
                    cp:data[i].cp,
                    product_name:data[i].product_name,
                };
                cash = data[i].cash_id;
                system = data[i].system;
                currency = data[i].currency;
                supplier = data[i].supplier_id;
                supplier_name = data[i].supplier_name;
            }
        }
        // console.log(JSON.stringify(purchases));

        final_data['purchases_returns'] = purchases_returns;
        final_data['print_receipt'] = print_receipt;
        console.log(final_data);
            receipt_promise = purchases_returns.length;
            // First create a receipt
            url = "/receipt/apiv1/create/purchasesreturnreceipt";
            rand = Math.floor(Math.random() * (9999 - 99 + 1)) + 99;
            // console.log(rand);
            receipt_number = "CPCRN"+rand;
            receipt_data = {
                number:receipt_number,
                purchases_receipt:$$("receipt_id").getValue(),
                supplier:supplier,
                cash:cash,
                system:system,
                currency:currency,
                supplier_name:supplier_name
            }
            webix.ajax().post(url,receipt_data,function(txt,resp){

                msg = resp.json();
                console.log(msg);
                if (msg.status) {
                    final_data['receipt'] = msg.object.id;
                    final_data['receipt_number'] = msg.object.number;
                    final_data['receipt_time'] = msg.object.timestamp;
                    final_data['supplier_name'] = supplier_name;
                    final_data['cash'] =  msg.object.cash;
                    final_data['system'] = msg.object.system;
                    final_data['currency'] = msg.object.currency;
                    url = "/pop/apiv1/create/cashpurchasereturn";
                    console.log(final_data);
                    webix.ajax().post(url,final_data,function(txt,resp){
                        msg = resp.json();
                        console.log(msg);
                        if (msg.status){
                            webix.message(msg.msg);
                            $$("pop_datatable").clearAll();
                            $$("load_receipt").focus();
                            $$("save_only").enable();
                            $$("save_and_print").enable();
                            $$("clear_purchases").enable();
                            $$("put_purchases_on_hold").enable();
                        }else{
                            webix.message(msg.msg,'error');
                            $$("save_only").enable();
                            $$("save_and_print").enable();
                            $$("clear_purchases").enable();
                            $$("put_purchases_on_hold").enable();
                        }
                    }).fail(function(){
                        webix.message("Action failed, something has definitely gone wrong. Refresh and try again or call SBK","error");
                    });
                }else{
                    webix.message("I couldn't create a receipt, for some reason please refresh and make sure that all the relevant data is provided.",'error');
                    $$("save_only").enable();
                    $$("save_and_print").enable();
                    $$("clear_purchases").enable();
                    $$("put_purchases_on_hold").enable();
                }
            }).fail(function(){
                webix.message("This receipt has been already been returned. You Can't return a receipt twice.","error");
                $$("save_only").enable();
                $$("save_and_print").enable();
                $$("clear_purchases").enable();
                $$("put_purchases_on_hold").enable();
            });
        }
}

var pop_buttons = {
    padding:30,
    cols:[
        {
            id:"clear_purchases",
            view:"button",
            label:"Clear",
            type:"iconButton",
            icon:"times",
            autowidth:true,
            click:function () {
                $$("pop_datatable").clearAll();
                $$("load_receipt").focus();
                $$("load_receipt").setValue("") ;
            }
        },
        {
            id:"put_purchases_on_hold",
            view:"button",
            label:"Put on hold",
            type:"iconButton",
            icon:"external-link",
            autowidth:true,
            click:function () {
                webix.message("Put current purchases on hold and process another one with intention to come back to it");
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
                // webix.message("Save purchases and print receipt");
                save_cash_purchases(true);
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
                save_cash_purchases(false);
            }
        }

    ]
}
