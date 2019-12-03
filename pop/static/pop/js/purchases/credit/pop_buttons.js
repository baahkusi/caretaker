function save_credit_purchases(print_invoice) {
    $$("save_only").disable();
    // $$("save_and_print").disable();
    $$("clear_purchases").disable();
    data = $$("pop_datatable").serialize();
    var final_data = {};
    var purchases = [];
    /*this is the purchases data we would pass to the server
    supplier,employee,product,quantity,sp,cp,product_name,amount,
    credit system, currency,is_base,rate
    */
    if (data.length === 0) {
        webix.message("Nothing to save", "error");
        $$("get_product").focus();
        $$("save_only").enable();
        // $$("save_and_print").enable();
        $$("clear_purchases").enable();

    } else {

        supplier = $$("get_supplier").getValue();
        if (supplier) {
            invoice = $$("get_invoice").getValue("");
            if (!invoice) {
                $$("save_only").enable();
                // $$("save_and_print").enable();
                $$("clear_purchases").enable();
                $$("get_invoice").focus();
                webix.message("You need to provide the invoice number from your supplier", "error");
                return;
            }
            webix.message("Prepare data to be saved");
            for (var i = 0; i < data.length; i++) {
                com = data[i].comment ? data[i].comment : "Credit Purchases";
                purchases[i] = {
                    product: data[i].id,
                    quantity: data[i].order_qty,
                    sp: data[i].sp,
                    cp: data[i].cp,
                    product_name: data[i].name,
                    comment: com,
                };
            }
            final_data['purchases'] = purchases;
            final_data['supplier'] = supplier;
            final_data['print_invoice'] = print_invoice;
            final_data['supplier_name'] = $$("get_supplier").getPopup().getList().getItem(supplier).value;
            invoice_promise = purchases.length;
            // First create a invoice
            rand = Math.floor(Math.random() * (9999 - 99 + 1)) + 99;
            // console.log(rand);
            invoice_number = invoice + "/PCI" + rand;
            invoice_data = {
                number: invoice_number,
                supplier: supplier,
                supplier_name: final_data['supplier_name'],
            };
            url = "/invoice/apiv1/create/purchasesinvoice";
            webix.ajax().post(url, invoice_data, function (txt, resp) {
                msg = resp.json();
                // console.log(msg);
                if (msg.status) {
                    final_data['invoice'] = msg.object.id;
                    final_data['invoice_number'] = msg.object.number;
                    final_data['invoice_time'] = msg.object.timestamp;
                    url = "/pop/apiv1/create/creditpurchase";
                    // console.log(final_data);
                    webix.ajax().post(url, final_data, function (txt, resp) {
                        msg = resp.json();
                        console.log(msg);
                        if (msg.status) {
                            webix.message(msg.msg);
                            $$("pop_datatable").clearAll();
                            $$("get_product").focus();
                            $$("get_supplier").setValue("");
                            $$("get_invoice").setValue("");
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
                    webix.message("I couldn't create a invoice, for some reason please refresh and make sure that all the relevant data is provided.", 'error');
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
        //         // webix.message("Save purchases and print invoice");
        //         save_credit_purchases(true);
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
                save_credit_purchases(false);
            }
        }

    ]
}
