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
    console.log(from);
    if (from && to) {
        cute = selected_customer.id;
        webix.ajax().get(uri,{start:from,end:to,id:cute},function(txt,res){
            data = res.json();
            $$(invoice).clearAll();
            $$(invoice).parse(data[dat]);
        });
    }else{
        webix.message("Date not provided ...");
    }
}

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
                                uri = "/customer/apiv1/helpers/sales";
                                webix.ajax().get(uri,selected_customer,function(text,response){
                					resp = response.json();
                                    $$("receive_payment_form").hide();
                					$$('sales_view_dt').clearAll();
                					$$('sales_view_dt').parse(resp.sales);
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

var sales_invoice = {
    id: "sales_view_dt",
    view: "datatable",
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
        {id:"amount", header:["Amount",{content:"numberFilter"}],format:webix.i18n.priceFormat,sort:"text",footer:{content:"summColumn"},fillspace:true},
        {id:"settled", header:["Settled",{content:"numberFilter"}],format:webix.i18n.priceFormat,sort:"text",footer:{content:"summColumn"},fillspace:true},
        {id:"rem", header:["Unsettled",{content:"numberFilter"}],format:webix.i18n.priceFormat,sort:"text",footer:{content:"summColumn"},fillspace:true,math:"[$r,amount]-[$r,settled]"},
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
                  uri = "/customer/apiv1/helpers/sales";
                  invoice_from_to(uri,from,to,invoice,'sales');
              }
          }
        ]
}

var sales_return_invoice = {
      id: "sales_return_view_dt",
      view: "datatable",
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
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",footer:{content:"summColumn"},fillspace:true},
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
                uri = "/customer/apiv1/helpers/sales";
                invoice_from_to(uri,from,to,invoice,'sr');
            }
        }
    ]

}

var customer_detail_window = {
    view:"window",
    id:"customer_detail_window",
    width:900,
    height:600,
    position:"center",
	move:true,
    resize:true,
    head:{
		cols:[
			{
				template:"Selected Customer's Details",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('customer_detail_window').hide();"),align:"right"
			}
		]
	} ,
    body:{
        view:"accordion",
        multi:false,
        type:"space",
        rows:[
        //    {
        //        header:"<b>Summary About Customer</b>",
        //        collapsed:false,
        //        body:{
        //            template:"sum"
        //        },
        //    },
           {
               header:"<b>Sales Made to Customer</b>",
               collapsed:false,
               body:{
                   rows:[
                       sales_invoice_tools,
                       sales_invoice
                   ]
               },
           },
           {
                header:"<b>Sales Returned By Customer</b>",
                collapsed:true,
                body:{
                    rows:[
                        sales_return_tools,
                        sales_return_invoice
                    ]
                },
            },
       ]
    }
};
