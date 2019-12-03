function save_cash_purchases(print_receipt) {
    $$("save_only").disable();
    // $$("save_and_print").disable();
    $$("clear_purchases").disable();
    data = $$("pop_datatable").serialize();
    var final_data = {};
    var purchases = [];
    /*this is the purchases data we would pass to the server
    supplier,employee,product,quantity,sp,cp,product_name,amount,
    cash system, currency,is_base,rate
    */
    if (data.length === 0) {
        webix.message("Nothing to save", "error");
        $$("get_product").focus();
        $$("save_only").enable();
        // $$("save_and_print").enable();
        $$("clear_purchases").enable();

    } else {
        payment_system_id = $$('get_payment_system').getValue();
        if (!payment_system_id) {
            webix.message("Select a Payment System");
            $$('get_payment_system').focus();
            $$("save_only").enable();
            // $$("save_and_print").enable();
            $$("clear_purchases").enable();
        } else {
            supplier = $$("get_supplier").getValue();
            if (supplier) {
                receipt = $$("get_receipt").getValue("");
                if (!receipt) {
                    $$("save_only").enable();
                    // $$("save_and_print").enable();
                    $$("clear_purchases").enable();
                    $$("get_receipt").focus();
                    webix.message("You need to provide the receipt number from your supplier", "error");
                    return;
                }
                webix.message("Prepare data to be saved");
                for (var i = 0; i < data.length; i++) {
                    com = data[i].comment ? data[i].comment : "Cash Purchases";
                    purchases[i] = {
                        product: data[i].id,
                        quantity: data[i].order_qty,
                        sp: data[i].sp,
                        cp: data[i].cp,
                        product_name: data[i].name,
                        comment: com,
                    };
                }
                // webix.message("supplier");
                payment_system = $$('get_payment_system').getPopup().getList().getItem(payment_system_id);
                final_data['purchases'] = purchases;
                final_data['supplier'] = supplier;
                final_data['supplier_name'] = $$("get_supplier").getPopup().getList().getItem(supplier).value;
                final_data['print_receipt'] = print_receipt;
                final_data['cash'] = payment_system['id'];
                final_data['system'] = payment_system['system'];
                final_data['currency'] = payment_system['currency'];
                receipt_promise = purchases.length;
                // First create a receipt
                url = "/receipt/apiv1/create/purchasesreceipt";

                // receipt_number = $$("get_receipt").getValue();
                rand = Math.floor(Math.random() * (9999 - 99 + 1)) + 99;
                // console.log(rand);
                receipt_number = receipt+"/PCR" + rand;
                receipt_data = {
                    number: receipt_number,
                    cash: payment_system['id'],
                    system: payment_system['system'],
                    currency: payment_system['currency'],
                    supplier: supplier,
                    supplier_name: final_data['supplier_name'],
                }
                webix.ajax().post(url, receipt_data, function (txt, resp) {
                    msg = resp.json();
                    console.log(msg);
                    if (msg.status) {
                        final_data['receipt'] = msg.object.id;
                        final_data['receipt_number'] = msg.object.number;
                        final_data['receipt_time'] = msg.object.timestamp;
                        url = "/pop/apiv1/create/cashpurchase";
                        console.log(final_data);
                        webix.ajax().post(url, final_data, function (txt, resp) {
                            msg = resp.json();
                            console.log(msg);
                            if (msg.status) {
                                webix.message(msg.msg);
                                $$("pop_datatable").clearAll();
                                $$("get_product").focus();
                                $$("get_supplier").setValue("");
                                $$("get_receipt").setValue("");
                                $$("save_only").enable();
                                // $$("save_and_print").enable();
                                $$("clear_purchases").enable();

                            } else {
                                webix.message(msg.msg, 'error');
                                $$("save_only").enable();
                                // $$("save_and_print").enable();
                                $$("clear_purchases").enable();

                            }
                        }).fail(function () {
                            webix.message("something went wrong refresh and try agian or call me.", "error")
                        });
                    } else {
                        webix.message("I couldn't create a receipt, for some reason please refresh and make sure that all the relevant data is provided.", 'error');
                        $$("save_only").enable();
                        // $$("save_and_print").enable();
                        $$("clear_purchases").enable();

                    }
                }).fail(function () {
                    webix.message("Some error occurred retry and if it persists, refresh the page", "error");
                    $$("save_only").enable();
                    // $$("save_and_print").enable();
                    $$("clear_purchases").enable();

                });
            } else {
                webix.message("You need to provide supplier information");
                $$("get_supplier").focus();
                $$("save_only").enable();
                // $$("save_and_print").enable();
                $$("clear_purchases").enable();

            }
        }
    }
}

var pop_buttons = {
    padding: 30,
    cols: [
        {
            id: "clear_purchases",
            view: "button",
            label: "Clear",
            type: "iconButton",
            icon: "times",
            autowidth: true,
            click: function () {
                $$("pop_datatable").clearAll();
                $$("get_product").focus();
                $$("get_product").setValue("");
            }
        },
        {},
        // {
        //     id:"save_and_print",
        //     view:"button",
        //     label:"Save & Print",
        //     type:"iconButton",
        //     icon:"print",
        //     autowidth:true,
        //     click:function () {
        //         webix.message("Save purchases and print receipt");
        //         save_cash_purchases(true);
        //     }
        // },
        {
            id: "save_only",
            view: "button",
            label: "Save only",
            type: "iconButton",
            icon: "save",
            autowidth: true,
            click: function () {
                save_cash_purchases(false);
            }
        }

    ]
}
