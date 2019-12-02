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

function invoice_from_to(uri,from,to,invoice,dat){
    from = $$(from).getValue().split(" ")[0];
    to = $$(to).getValue().split(" ")[0];
    console.log(dat);
    if (from && to) {
        var sup = selected_supplier.id;
        webix.ajax().get(uri,{start:from,end:to,id:sup},function(txt,res){
            data = res.json();
            console.log(data);
            $$(invoice).clearAll();
            console.log(data[dat]);
            $$(invoice).parse(data[dat]);
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
                                uri = "/supplier/apiv1/helpers/purchases";
                                webix.ajax().get(uri,selected_supplier,function(text,response){
                					resp = response.json();
                                    $$("make_payment_window").hide();
                					$$('purchases_view_dt').clearAll();
                					$$('purchases_view_dt').parse(resp.purchases);
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
        {id:"sp", header:"Unit Price",fillspace:true},
        {id:"amt", header:["Amount"],math:"[$r,sp]*[$r,quantity]",footer:{content:"summColumn"},sort:"int",fillspace:true},
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

var purchases_invoice = {
      id: "purchases_view_dt",
      view: "datatable",
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
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",footer:{content:"summColumn"},fillspace:true},
          {id:"settled", header:["Settled",{content:"numberFilter"}],sort:"text",footer:{content:"summColumn"},fillspace:true},
          {id:"rem", header:["Unsettled",{content:"numberFilter"}],sort:"text",footer:{content:"summColumn"},fillspace:true,math:"[$r,amount]-[$r,settled]"},
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
        //         item = $$("purhcases_view_dt").getSelectedItem();
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
                uri = "/supplier/apiv1/helpers/purchases";
                invoice_from_to(uri,from,to,invoice,'purchases');
            }
        }
    ]

}

var purchases_return_invoice = {
      id: "purchases_return_view_dt",
      view: "datatable",
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
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",footer:{content:"summColumn"},fillspace:true},
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
                uri = "/supplier/apiv1/helpers/purchases";
                invoice_from_to(uri,from,to,invoice,'pr');
            }
        }
    ]
}


var supplier_detail_window = {
    view:"window",
    id:"supplier_detail_window",
    width:900,
    height:600,
    position:"center",
	move:true,
    resize:true,
    head:{
		cols:[
			{
				template:"Selected Supplier's Details",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('supplier_detail_window').hide();"),align:"right"
			}
		]
	} ,
    body:{
        view:"accordion",
        multi:false,
        type:"space",
        animate:true,
        rows:[
        //    {
        //        header:"<b>Summary About Supplier</b>",
        //        collapsed:false,
        //        animate:{subtype:"together"},
        //        body:{
        //            template:"sum"
        //        },
        //    },
           {
               header:"<b>Purchases From Supplier</b>",
               collapsed:false,
               body:{
                   rows:[
                       purchases_tools,
                       purchases_invoice
                   ]
               },
           },
           {
                header:"<b>Purchases Returned to Supplier</b>",
                collapsed:true,
                body:{
                    rows:[
                        purchases_return_tools,
                        purchases_return_invoice
                    ]
                },
            },
       ]
    }
};
