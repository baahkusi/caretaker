function void_receipt(uri,receipt){
    webix.confirm({
        title:"Confirm void",
        text:"Are you sure you want to continue with voiding the receipt?",
        ok:"Yes",cancel:"No",
        type:"confirm-warning",
        callback:function(result){
            if (result) {
                item = $$(receipt).getSelectedItem();
                console.log(item);
                if (!item) {
                    webix.message("No receipt selected")
                }else{

                    webix.ajax().post(uri,{id:item.id},function(txt,res){
                        data = res.json();
                        if (data.status) {
                            item.stati = 'Voided';
                            $$(receipt).refresh();
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

function recall_receipt(uri,receipt){
    item = $$(receipt).getSelectedItem();
    if (!item) {
        webix.message("No receipt selected")
    }else{

        receipt_number = item.number.split(' / ')[0];
        webix.ajax().get(uri,{number:receipt_number},function(text,response){
            msg = response.json();
            console.log(msg);
            // if (msg.status) {
            //   $$("all_receipt_window").getBody().clear();
              $$('all_receipt_dt').clearAll();
              $$("all_receipt_window").show();
              $$("all_receipt_dt").parse(msg.r_objects);
            // }
        });
   }
}

function receipt_from_to(uri,from,to,receipt){
    from = $$(from).getValue().split(" ")[0];
    to = $$(to).getValue().split(" ")[0];
    console.log(from);
    if (from && to) {
        webix.ajax().get(uri,{start:from,end:to},function(txt,res){
            data = res.json();
            $$(receipt).clearAll();
            $$(receipt).parse(data);
        });
    }else{
        webix.message("Date not provided ...");
    }
}

var all_receipt_dt = {
    view: "datatable",
    id:"all_receipt_dt",
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

var all_receipt_window = {
    view:"window",
    id:"all_receipt_window",
    position:"center",
	move:true,
    resize:true,
    head:{
		cols:[
			{
				template:"Receipt Details",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('all_receipt_window').hide();"),align:"right"
			}
		]
	},
    body:webix.copy(all_receipt_dt)
};

var sales_receipt = {
    id: "sales_view_dt",
    view: "datatable",
    url:"/receipt/apiv1/query/salesreceipts",
    select:"row",
    footer:true,
    math:true,
    columns:[
        {id:"id", header:"#",hidden:true},
        {id:"date", header:"Date",sort:"text",fillspace:true},
        {id:"time", header:"Time",sort:"text",fillspace:true},
        {id:"number", header:["Receipt ID",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"customer_name", header:["Customer",{content:"selectFilter"}],sort:"text",fillspace:true},
        {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
        {id:"stati", header:["Status",{content:"selectFilter"}],sort:"text",fillspace:true},
        // {id:"tax", header:["Tax",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        // {id:"discount", header:["Discount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        {id:"payment", header:["Payment Method",{content:"selectFilter"}],sort:"text",fillspace:true},
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

var sales_receipt_tools = {
      view:"toolbar",
      id:"sales_bar",
      cols:[
          {
              view:"button",
              value:"Void",
              width: 100,
              click:function(){
                 receipt = "sales_view_dt";
                 uri = '/receipt/apiv1/helpers/void/salesreceipt';
                 void_receipt(uri,receipt);
              }
          },
        //   {
        //       view:"button",
        //       value:"Return",
        //       width: 120,
        //       click:function(){
        //           item = $$("sales_view_dt").getSelectedItem();
        //           if (!item) {
        //               webix.message("No receipt selected")
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
                  receipt = "sales_view_dt";
                  uri = "/receipt/apiv1/helpers/recall/sales";
                  recall_receipt(uri,receipt);
             }
          },{},
          {
              id:"start_sales_receipt",
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
              id:"end_sales_receipt",
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
                  receipt = "sales_view_dt";
                  from = "start_sales_receipt";
                  to = "end_sales_receipt";
                  uri = "/receipt/apiv1/query/salesreceipts";
                  receipt_from_to(uri,from,to,receipt);
              }
          }
        ]
}

var sales_return_receipt = {
      id: "sales_return_view_dt",
      view: "datatable",
      url:"/receipt/apiv1/query/salesreturnreceipts",
      select:"row",
      footer:true,
      math:true,
      columns:[
          {id:"id", header:"#",hidden:true},
          {id:"date", header:"Date",sort:"text",fillspace:true},
          {id:"time", header:"Time",sort:"text",fillspace:true},
          {id:"number", header:["Receipt ID",{content:"textFilter"}],sort:"text",fillspace:true},
          {id:"customer_name", header:["Customer",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
        //   {id:"stati", header:["Status",{content:"selectFilter"}],sort:"text",fillspace:true},
        //   {id:"tax", header:["Tax",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        //   {id:"discount", header:["Discount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"payment", header:["Payment Method",{content:"selectFilter"}],sort:"text",fillspace:true},
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
                receipt = "sales_return_view_dt";
                uri = '/receipt/apiv1/helpers/void/salesreturnreceipt';
                void_receipt(uri,receipt);
            }
        },
        {
            view:"button",
            value:"Details",
            width: 130,
            click:function(){
                receipt = "sales_return_view_dt";
                uri = "/receipt/apiv1/helpers/recall/salesreturns";
                recall_receipt(uri,receipt);
            }
        },{},
        {
            id:"start_sales_return_receipt",
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
            id:"end_sales_return_receipt",
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
                receipt = "sales_return_view_dt";
                from = "start_sales_return_receipt";
                to = "end_sales_return_receipt";
                uri = "/receipt/apiv1/query/salesreturnreceipts";
                receipt_from_to(uri,from,to,receipt);
            }
        }
    ]

}

var purchases_receipt = {
      id: "purchases_view_dt",
      view: "datatable",
      url:"/receipt/apiv1/query/purchasesreceipts",
      select:"row",
      footer:true,
      math:true,
      columns:[
          {id:"id", header:"#",hidden:true},
          {id:"date", header:"Date",sort:"text",fillspace:true},
          {id:"time", header:"Time",sort:"text",fillspace:true},
          {id:"number", header:["Receipt ID",{content:"textFilter"}],sort:"text",fillspace:true},
          {id:"supplier_name", header:["Supplier",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"stati", header:["Status",{content:"selectFilter"}],sort:"text",fillspace:true},
        //   {id:"tax", header:["Tax",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        //   {id:"discount", header:["Discount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"payment", header:["Payment Method",{content:"selectFilter"}],sort:"text",fillspace:true},
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
                receipt = "purchases_view_dt";
                uri = '/receipt/apiv1/helpers/void/purchasesreceipt';
                void_receipt(uri,receipt);
            }
        },
        // {
        //     view:"button",
        //     value:"Return",
        //     width: 120,
        //     click:function(){
        //         item = $$("sales_view_dt").getSelectedItem();
        //         if (!item) {
        //             webix.message("No receipt selected")
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
                receipt = "purchases_view_dt";
                uri = "/receipt/apiv1/helpers/recall/purchases";
                recall_receipt(uri,receipt);
            }
        },{},
        {
            id:"start_purchases_receipt",
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
            id:"end_purchases_receipt",
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
                receipt = "purchases_view_dt";
                from = "start_purchases_receipt";
                to = "end_purchases_receipt";
                uri = "/receipt/apiv1/query/purchasesreceipts";
                receipt_from_to(uri,from,to,receipt);
            }
        }
    ]

}

var purchases_return_receipt = {
      id: "purchases_return_view_dt",
      view: "datatable",
      url:"/receipt/apiv1/query/purchasesreturnreceipts",
      select:"row",
      footer:true,
      math:true,
      columns:[
          {id:"id", header:"#",hidden:true},
          {id:"date", header:"Date",sort:"text",fillspace:true},
          {id:"time", header:"Time",sort:"text",fillspace:true},
          {id:"number", header:["Receipt ID",{content:"textFilter"}],sort:"text",fillspace:true},
          {id:"supplier_name", header:["Supplier",{content:"selectFilter"}],sort:"text",fillspace:true},
          {id:"employee", header:["User",{content:"selectFilter"}],sort:"text",fillspace:true},
        //   {id:"stati", header:["Status",{content:"selectFilter"}],sort:"text",fillspace:true},
        //   {id:"tax", header:["Tax",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
        //   {id:"discount", header:["Discount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"amount", header:["Amount",{content:"numberFilter"}],sort:"text",format:webix.i18n.priceFormat,footer:{content:"summColumn"},fillspace:true},
          {id:"payment", header:["Payment Method",{content:"selectFilter"}],sort:"text",fillspace:true},
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
                receipt = "purchases_return_view_dt";
                uri = '/receipt/apiv1/helpers/void/purchasesreturnreceipt';
                void_receipt(uri,receipt);
            }
        },
        {
            view:"button",
            value:"Details",
            width: 130,
            click:function(){
                receipt = "purchases_return_view_dt";
                uri = "/receipt/apiv1/helpers/recall/purchasesreturns";
                recall_receipt(uri,receipt);
            }
        },{},
        {
            id:"start_purchases_return_receipt",
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
            id:"end_purchases_return_receipt",
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
                receipt = "purchases_return_view_dt";
                from = "start_purchases_return_receipt";
                to = "end_purchases_return_receipt";
                uri = "/receipt/apiv1/query/purchasesreturnreceipts";
                receipt_from_to(uri,from,to,receipt);
            }
        }
    ]
}

var receipts_tabs = {
    id:"receipts_tabs",
    view:"tabbar",
    value:"sales_tools",
    multiview: true,
    options:[
        {id:"sales_tools",value:"Sales Receipts"},
        {id:"sales_return_tools",value:"Sales Return Receipts"},
        {id:"purchases_tools",value:"Purchases Receipts"},
        {id:"purchases_return_tools",value:"Purchases Return Receipts"},
    ],
    on:{
        onAfterTabClick:function(id){
            switch (id) {
                case "sales_tools":
                    $$("receipts_tools").setValue("sales_bar");
                    $$("receipts_views").setValue("sales_view_dt");
                    break;
                case "sales_return_tools":
                    $$("receipts_tools").setValue("sales_return_bar");
                    $$("receipts_views").setValue("sales_return_view_dt");
                    break;
                case "purchases_tools":
                    $$("receipts_tools").setValue("purchases_bar");
                    $$("receipts_views").setValue("purchases_view_dt");
                    break;
                case "purchases_return_tools":
                    $$("receipts_tools").setValue("purchases_return_bar");
                    $$("receipts_views").setValue("purchases_return_view_dt");
                    break;
                default:
                    webix.message("Error ...")
            }
        }
    }
}

var receipts_tools = {
    id:"receipts_tools",
    view:"multiview",
    borderless:true,
    animate:false,
    cells:[
        sales_receipt_tools,
        sales_return_tools,
        purchases_tools,
        purchases_return_tools
    ]
}

var receipts_views = {
  id:"receipts_views",
  view: "multiview",
  cells: [
    sales_receipt,
    sales_return_receipt,
    purchases_receipt,
    purchases_return_receipt
  ]
}

var receipts = {
    rows:[
        receipts_tabs,
        receipts_tools,
        receipts_views,
    ]
}
