function void_invoice(uri,invoice){
    webix.confirm({
        title:"Confirm void",
        text:"Are you sure you want to continue with voiding the invoice?",
        ok:"Yes",cancel:"No",
        type:"confirm-warning",
        callback:function(result){
            if (result) {
                item = $$(invoice).getSelectedItem();
                console.log(item);
                if (!item) {
                    webix.message("No invoice selected")
                }else{

                    webix.ajax().post(uri,{id:item.id},function(txt,res){
                        data = res.json();
                        if (data.status) {
                            item.stati = 'Voided';
                            $$(invoice).refresh();
                            webix.message(data.msg);
                        }else{
                            webix.message(data.msg);
                        }
                    });
                }
            }else{

            }
        }
    });
}

function recall_invoice(uri,invoice){
    item = $$(invoice).getSelectedItem();
    if (!item) {
        webix.message("No invoice selected")
    }else{

        invoice_number = item.number.split(' / ')[0];
        webix.ajax().get(uri,{number:invoice_number},function(text,response){
            msg = response.json();
            console.log(msg);
            // if (msg.status) {
            //   $$("all_invoice_window").getBody().clear();
              $$('all_invoice_dt').clearAll();
              $$("all_invoice_window").show();
              $$("all_invoice_dt").parse(msg.r_objects);
            // }
        });
   }
}

function invoice_from_to(uri,from,to,invoice){
    from = $$(from).getValue().split(" ")[0];
    to = $$(to).getValue().split(" ")[0];
    console.log(from);
    if (from && to) {
        webix.ajax().get(uri,{start:from,end:to},function(txt,res){
            data = res.json();
            $$(invoice).clearAll();
            $$(invoice).parse(data);
        });
    }else{
        webix.message("Date not provided ...");
    }
}

var make_payment_form = {
	id:"make_payment_form",
	view:"form",
	borderless:true,
	elements: [
		{ view:"text", label:'Supplier', name:"supplier_name",disabled:true,readonly:true },
		{ view:"text", label:'Receipt Total', name:"amount",disabled:true,readonly:true },
        {
            cols:[
                { view:"text", label:'Amount Settled', name:"settled",disabled:true,readonly:true },
                { view:"text", label:'Amount Remaining', name:"rem",disabled:true,readonly:true },
            ]
        },

        {view:"counter", step:10,label:'Amount to Receive', name:"pay",min:0 },
        { view:"combo", label:'Payment Method', name:"payment_method",
		options:"/cash/apiv1/helpers/systems" },
		{
            view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("make_payment_form").getValues();
                if (!fparam.payment_method || fparam.pay <= 0) {
                    if (!fparam.payment_method) {
                        webix.message("You need to select a payment method");
                    }else if (fparam.pay <= 0) {
                        webix.message("Amount to be paid must be greater than zero");
                    }
                }else{
                    console.log(fparam);
                    if (fparam.pay > fparam.rem) {
                        webix.message('The amount being paid is greater than the amount owed');
                    }else{
                        var pay = $$('make_payment_form').elements.payment_method.getPopup().getList().getItem(fparam.payment_method);
                        fparam.currency = pay.currency;
                        fparam.system = pay.system;
                        fparam.payment_value = pay.value;
                        fparam.cash_intent = 'dec';
                        console.log(pay);
                        uri = "/invoice/apiv1/helpers/pay/purchasesinvoice";
        				webix.ajax().post(uri,fparam
        					, function(text,response) {
        					// console.log(text);
        					// console.log(response);
        					msg = response.json();
        					if (msg.status){
                                $$("purchases_view_dt").load("/invoice/apiv1/query/purchasesinvoices",function(){
        							$$("make_payment_form").hide(); //hide window
        							$$("purchases_view_dt").showItem(fparam.id);
        							$$("purchases_view_dt").select(fparam.id);
        						});
        					}else{
        						webix.message(msg.msg,'error');
        					}
        				});
                    }
                }


            }
			else{
				webix.message({ type:"error", text:"Form data is invalid" });
			}
		}
    }
	],
	elementsConfig:{
		labelPosition:"top",
	}
};

var make_payment_window = {
    view:"window",
    id:"make_payment_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Receive Payment Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('make_payment_window').hide();"),align:"right"
			}
		]
	},
    body:webix.copy(make_payment_form)
};

var receive_payment_form = {
    id:"receive_payment_form",
    view:"form",
    borderless:true,
    elements: [
        { view:"text", label:'Customer', name:"customer_name",disabled:true,readonly:true },
        { view:"text", label:'Receipt Total', name:"amount",disabled:true,readonly:true },
        {
            cols:[
                { view:"text", label:'Amount Settled', name:"settled",disabled:true,readonly:true },
                { view:"text", label:'Amount Remaining', name:"rem",disabled:true,readonly:true },
            ]
        },

        {view:"counter", step:10,label:'Amount to Receive', name:"pay",min:0 },
        { view:"combo", label:'Payment Method', name:"payment_method",
        options:"/cash/apiv1/helpers/systems" },
        {
            view:"button", value: "Submit", click:function(){
            if (this.getParentView().validate()){ //validate form
                var fparam = $$("receive_payment_form").getValues();
                if (!fparam.payment_method || fparam.pay <= 0) {
                    if (!fparam.payment_method) {
                        webix.message("You need to select a payment method");
                    }else if (fparam.pay <= 0) {
                        webix.message("Amount to be paid must be greater than zero");
                    }
                }else{
                    console.log(fparam);
                    if (fparam.pay > fparam.rem) {
                        webix.message('The amount being paid is greater than the amount owed');
                    }else{
                        var pay = $$('receive_payment_form').elements.payment_method.getPopup().getList().getItem(fparam.payment_method);
                        fparam.currency = pay.currency;
                        fparam.system = pay.system;
                        fparam.payment_value = pay.value;
                        fparam.cash_intent = 'inc';
                        console.log(pay);
                        uri = "/invoice/apiv1/helpers/pay/salesinvoice";
                        webix.ajax().post(uri,fparam
                            , function(text,response) {
                            // console.log(text);
                            // console.log(response);
                            msg = response.json();
                            if (msg.status){
                                $$("sales_view_dt").load("/invoice/apiv1/query/salesinvoices",function(){
                                    $$("receive_payment_form").hide(); //hide window
                                    $$("sales_view_dt").showItem(fparam.id);
                                    $$("sales_view_dt").select(fparam.id);
                                });
                            }else{
                                webix.message(msg.msg,'error');
                            }
                        });
                    }
                }


            }
            else{
                webix.message({ type:"error", text:"Form data is invalid" });
            }
        }
    }
    ],
    elementsConfig:{
        labelPosition:"top",
    }
}

var receive_payment_window = {
    view:"window",
    id:"receive_payment_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Receive Payment Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('receive_payment_window').hide();"),align:"right"
			}
		]
	},
    body:webix.copy(receive_payment_form)
}

var all_invoice_dt = {
    view: "datatable",
    id:"all_invoice_dt",
    select:"row",
    width:500,
    math:true,
    footer:true,
    select:true,
    columns:[
        {id:"product_name", header:"Item / Product",fillspace:true,footer:"Sub Total :"},
        {id:"quantity", header:"Quantity",fillspace:true,editor:"text"},
        {id:"sp", header:"Unit Price",fillspace:true,format:webix.i18n.priceFormat},
        {id:"amt", header:["Amount"],math:"[$r,sp]*[$r,quantity]",footer:{content:"summColumn"},sort:"int",fillspace:true,format:webix.i18n.priceFormat},
    ],
    on:{
        onBeforLoad:function(){
            this.showOverlay("Loading data ...");
        },
        onAfterLoad:function(){
            this.hideOverlay();
        }
    }
};

var all_invoice_window = {
    view:"window",
    id:"all_invoice_window",
    position:"center",
	move:true,
    resize:true,
    head:{
		cols:[
			{
				template:"Invoice Details",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('all_invoice_window').hide();"),align:"right"
			}
		]
	},
    body:webix.copy(all_invoice_dt)
};

var sales_invoice = {
    id: "sales_view_dt",
    view: "datatable",
    url:"/invoice/apiv1/query/salesinvoices",
    select:"row",
    footer:true,
    math:true,
    columns:[
        {id:"id", header:"#",hidden:true},
        {id:"date", header:"Date",sort:"text",fillspace:true},
        {id:"time", header:"Time",sort:"text",fillspace:true},
        {id:"number", header:["Invoice ID",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"customer_name", header:["Customer",{content:"selectFilter"}],sort:"text",fillspace:true},
        {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
        {id:"stati", header:["Status",{content:"selectFilter"}],sort:"text",fillspace:true},
        {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        {id:"settled", header:["Settled",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        {id:"rem", header:["Unsettled",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true,math:"[$r,amount]-[$r,settled]"},
    ],
    on:{
        onBeforLoad:function(){
            this.showOverlay("Loading data ...");
        },
        onAfterLoad:function(){
            this.hideOverlay();
        }
    }
}

var sales_invoice_tools = {
      view:"toolbar",
      id:"sales_bar",
      cols:[
          {
              view:"button",
              value:"Void",
              width: 100,
              click:function(){
                 invoice = "sales_view_dt";
                 uri = '/invoice/apiv1/helpers/void/salesinvoice';
                 void_invoice(uri,invoice);
              }
          },
        //   {
        //       view:"button",
        //       value:"Return",
        //       width: 120,
        //       click:function(){
        //           item = $$("sales_view_dt").getSelectedItem();
        //           if (!item) {
        //               webix.message("No invoice selected")
        //           }else{
          //
        //           }
        //       }
        //   },
          {
              view:"button",
              value:"Details",
              width: 130,
              click:function(){
                  invoice = "sales_view_dt";
                  uri = "/invoice/apiv1/helpers/recall/sales";
                  recall_invoice(uri,invoice);
             }
          },
          {
              view:"button",
              value:"Receive Payment From Creditor",
              width: 280,
              click:function(){
                  var prc = $$("sales_view_dt").getSelectedItem();
                  console.log(prc);
                  if (prc.status == '000') {
                      webix.message("This action cannot be performed on a voided invoice");
                  }else{
                      if (prc){
      					$$("receive_payment_window").getBody().clear();
      	                $$("receive_payment_window").show();
      					$$("receive_payment_form").parse(prc);
      	                $$("receive_payment_window").getBody().focus();
      				}else{
      					webix.message("No row is selected","error");
      					webix.message("Select a row by clicking on it");
      				}
                  }
             }
          },{},
          {
              id:"start_sales_invoice",
              view: "datepicker",
              stringResult:true,
              width: 250,
              placeholder:"from ...",
              timepicker: true
          },
          {
              view:"label",
              width:30,
              label:" - "
          },
          {
              id:"end_sales_invoice",
              view: "datepicker",
              stringResult:true,
              width: 250,
              placeholder: "to ..",
              timepicker: true
          },
          {
              view:"button",
              value:"Filter date",
              width: 150,
              click:function(){
                  invoice = "sales_view_dt";
                  from = "start_sales_invoice";
                  to = "end_sales_invoice";
                  uri = "/invoice/apiv1/query/salesinvoices";
                  invoice_from_to(uri,from,to,invoice);
              }
          }
        ]
}

var sales_return_invoice = {
      id: "sales_return_view_dt",
      view: "datatable",
      url:"/invoice/apiv1/query/salesreturninvoices",
      select:"row",
      footer:true,
      math:true,
      columns:[
          {id:"id", header:"#",hidden:true},
          {id:"date", header:"Date",sort:"text",fillspace:true},
          {id:"time", header:"Time",sort:"text",fillspace:true},
          {id:"number", header:["Invoice ID",{content:"textFilter"}],sort:"text",fillspace:true},
          {id:"customer_name", header:["Customer",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
      ],
      on:{
          onBeforLoad:function(){
              this.showOverlay("Loading data ...");
          },
          onAfterLoad:function(){
              this.hideOverlay();
          }
      }
}

var sales_return_tools = {
    view:"toolbar",
    id:"sales_return_bar",
    cols:[
        {
            view:"button",
            value:"Void",
            width: 100,
            click:function(){
                invoice = "sales_return_view_dt";
                uri = '/invoice/apiv1/helpers/void/salesreturninvoice';
                void_invoice(uri,invoice);
            }
        },
        {
            view:"button",
            value:"Details",
            width: 130,
            click:function(){
                invoice = "sales_return_view_dt";
                uri = "/invoice/apiv1/helpers/recall/salesreturns";
                recall_invoice(uri,invoice);
            }
        },{},
        {
            id:"start_sales_return_invoice",
            view: "datepicker",
            stringResult:true,
            width: 250,
            placeholder:"from ...",
            timepicker: true
        },
        {
            view:"label",
            width:30,
            label:" - "
        },
        {
            id:"end_sales_return_invoice",
            view: "datepicker",
            stringResult:true,
            width: 250,
            placeholder: "to ..",
            timepicker: true
        },
        {
            view:"button",
            value:"Filter date",
            width: 150,
            click:function(){
                invoice = "sales_return_view_dt";
                from = "start_sales_return_invoice";
                to = "end_sales_return_invoice";
                uri = "/invoice/apiv1/query/salesreturninvoices";
                invoice_from_to(uri,from,to,invoice);
            }
        }
    ]

}

var purchases_invoice = {
      id: "purchases_view_dt",
      view: "datatable",
      url:"/invoice/apiv1/query/purchasesinvoices",
      select:"row",
      footer:true,
      math:true,
      columns:[
          {id:"id", header:"#",hidden:true},
          {id:"date", header:"Date",sort:"text",fillspace:true},
          {id:"time", header:"Time",sort:"text",fillspace:true},
          {id:"number", header:["Invoice ID",{content:"textFilter"}],sort:"text",fillspace:true},
          {id:"supplier_name", header:["Supplier",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"stati", header:["Status",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"settled", header:["Settled",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"rem", header:["Unsettled",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true,math:"[$r,amount]-[$r,settled]"},
      ],
      on:{
          onBeforLoad:function(){
              this.showOverlay("Loading data ...");
          },
          onAfterLoad:function(){
              this.hideOverlay();
          }
      }
}

var purchases_tools = {
    view:"toolbar",
    id:"purchases_bar",
    cols:[
        {
            view:"button",
            value:"Void",
            width: 100,
            click:function(){
                invoice = "purchases_view_dt";
                uri = '/invoice/apiv1/helpers/void/purchasesinvoice';
                void_invoice(uri,invoice);
            }
        },
        // {
        //     view:"button",
        //     value:"Return",
        //     width: 120,
        //     click:function(){
        //         item = $$("sales_view_dt").getSelectedItem();
        //         if (!item) {
        //             webix.message("No invoice selected")
        //         }else{
        //
        //         }
        //     }
        // },
        {
            view:"button",
            value:"Details",
            width: 130,
            click:function(){
                invoice = "purchases_view_dt";
                uri = "/invoice/apiv1/helpers/recall/purchases";
                recall_invoice(uri,invoice);
            }
        },
        {
            view:"button",
            value:"Make Payment to Supplier",
            width: 280,
            click:function(){
                var prc = $$("purchases_view_dt").getSelectedItem();
                console.log(prc);
                if (prc.status == '000') {
                    webix.message("This action cannot be performed on a voided invoice");
                }else{
                    if (prc){
    					$$("make_payment_window").getBody().clear();
    	                $$("make_payment_window").show();
    					$$("make_payment_form").parse(prc);
    	                $$("make_payment_window").getBody().focus();
    				}else{
    					webix.message("No row is selected","error");
    					webix.message("Select a row by clicking on it");
    				}
                }

           }
        },{},
        {
            id:"start_purchases_invoice",
            view: "datepicker",
            stringResult:true,
            width: 250,
            placeholder:"from ...",
            timepicker: true
        },
        {
            view:"label",
            width:30,
            label:" - "
        },
        {
            id:"end_purchases_invoice",
            view: "datepicker",
            stringResult:true,
            width: 250,
            placeholder: "to ..",
            timepicker: true
        },
        {
            view:"button",
            value:"Filter date",
            width: 150,
            click:function(){
                invoice = "purchases_view_dt";
                from = "start_purchases_invoice";
                to = "end_purchases_invoice";
                uri = "/invoice/apiv1/query/purchasesinvoices";
                invoice_from_to(uri,from,to,invoice);
            }
        }
    ]

}

var purchases_return_invoice = {
      id: "purchases_return_view_dt",
      view: "datatable",
      url:"/invoice/apiv1/query/purchasesreturninvoices",
      select:"row",
      footer:true,
      math:true,
      columns:[
          {id:"id", header:"#",hidden:true},
          {id:"date", header:"Date",sort:"text",fillspace:true},
          {id:"time", header:"Time",sort:"text",fillspace:true},
          {id:"number", header:["Invoice ID",{content:"textFilter"}],sort:"text",fillspace:true},
          {id:"supplier_name", header:["Supplier",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
      ],
      on:{
          onBeforLoad:function(){
              this.showOverlay("Loading data ...");
          },
          onAfterLoad:function(){
              this.hideOverlay();
          }
      },
}

var purchases_return_tools = {
    view:"toolbar",
    id:"purchases_return_bar",
    cols:[
        {
            view:"button",
            value:"Void",
            width: 100,
            click:function(){
                invoice = "purchases_return_view_dt";
                uri = '/invoice/apiv1/helpers/void/purchasesreturninvoice';
                void_invoice(uri,invoice);
            }
        },
        {
            view:"button",
            value:"Details",
            width: 130,
            click:function(){
                invoice = "purchases_return_view_dt";
                uri = "/invoice/apiv1/helpers/recall/purchasesreturns";
                recall_invoice(uri,invoice);
            }
        },{},
        {
            id:"start_purchases_return_invoice",
            view: "datepicker",
            stringResult:true,
            width: 250,
            placeholder:"from ...",
            timepicker: true
        },
        {
            view:"label",
            width:30,
            label:" - "
        },
        {
            id:"end_purchases_return_invoice",
            view: "datepicker",
            stringResult:true,
            width: 250,
            placeholder: "to ..",
            timepicker: true
        },
        {
            view:"button",
            value:"Filter date",
            width: 150,
            click:function(){
                invoice = "purchases_return_view_dt";
                from = "start_purchases_return_invoice";
                to = "end_purchases_return_invoice";
                uri = "/invoice/apiv1/query/purchasesreturninvoices";
                invoice_from_to(uri,from,to,invoice);
            }
        }
    ]
}

var invoices_tabs = {
    id:"invoices_tabs",
    view:"tabbar",
    value:"sales_tools",
    multiview: true,
    options:[
        {id:"sales_tools",value:"Sales Invoices"},
        {id:"sales_return_tools",value:"Sales Return Invoices"},
        {id:"purchases_tools",value:"Purchases Invoices"},
        {id:"purchases_return_tools",value:"Purchases Return Invoices"},
    ],
    on:{
        onAfterTabClick:function(id){
            switch (id) {
                case "sales_tools":
                    $$("invoices_tools").setValue("sales_bar");
                    $$("invoices_views").setValue("sales_view_dt");
                    break;
                case "sales_return_tools":
                    $$("invoices_tools").setValue("sales_return_bar");
                    $$("invoices_views").setValue("sales_return_view_dt");
                    break;
                case "purchases_tools":
                    $$("invoices_tools").setValue("purchases_bar");
                    $$("invoices_views").setValue("purchases_view_dt");
                    break;
                case "purchases_return_tools":
                    $$("invoices_tools").setValue("purchases_return_bar");
                    $$("invoices_views").setValue("purchases_return_view_dt");
                    break;
                default:
                    webix.message("Error ...")
            }
        }
    }
}

var invoices_tools = {
    id:"invoices_tools",
    view:"multiview",
    borderless:true,
    animate:false,
    cells:[
        sales_invoice_tools,
        sales_return_tools,
        purchases_tools,
        purchases_return_tools
    ]
}

var invoices_views = {
  id:"invoices_views",
  view: "multiview",
  cells: [
    sales_invoice,
    sales_return_invoice,
    purchases_invoice,
    purchases_return_invoice
  ]
}

var invoices = {
    rows:[
        invoices_tabs,
        invoices_tools,
        invoices_views,
    ]
}
