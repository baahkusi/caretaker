function load_receipt_items(){
    var receipt_number = $$("load_receipt").getValue();
    receipt_number = receipt_number.replace(/ /gi,"");
    if (receipt_number) {
        uri = "/receipt/apiv1/helpers/recall/sales";
        webix.ajax().get(uri,{number:receipt_number},function(text,response){
            msg = response.json();
            console.log(msg);
            if (msg.status) {
                $$("pos_datatable").clearAll();
                $$("pos_datatable").parse(msg.r_objects);
                $$("receipt_date").setValue(msg.q_objects.date);
                $$("receipt_time").setValue(msg.q_objects.time);
                $$("receipt_id").setValue(msg.q_objects.id);
                $$("get_customer").setValue(msg.q_objects.customer_name);
                var system = msg.q_objects.system+" ~ "+msg.q_objects.currency;
                $$("payment_system").setValue(system);
            }else{
                switch (msg.code) {
                    case "600":
                        webix.message("This receipt has already been returned.I can't return a receipt twice","error");
                        webix.alert("This receipt has already been returned.I can't return a receipt twice","alert-error");
                        break;
                    case "000":
                        webix.message("This receipt is voided and no longer holds any effect, I can't return a voided receipt","error");
                        webix.alert("This receipt is voided and no longer holds any effect, I can't return a voided receipt","alert-error");
                        break;
                    default:
                    webix.message("Invalid Receipt Number","error");
                    webix.alert("Invalid Receipt Number","alert-error");
                }

            }
        });
    }else{
        webix.message("Please Enter a Receipt Number","error");
        $$("load_receipt").focus();
    }
}

var load_receipt = {
    padding:20,
	rows:[
		{
		cols:[
			{
				id:"load_receipt",
				view:"text",
				placeholder:"Enter Receipt Number Here ...",
                on:{
                    onEnter:function(){
                        load_receipt_items();
                    }
                }
			},
			{
				view:"button",
				label:"Load ",
				type:"iconButton",
				icon:"history",
				autowidth:true,
                click:function(){
                    load_receipt_items();
                }
			},
            {
				id:"get_customer",
				view:"text",
				placeholder:"Customer Name ...",
                readonly:true,
			},
            {
				id:"receipt_id",
				view:"text",
                readonly:true,
                hidden:true,
			},
            {
				id:"receipt_date",
				view:"text",
                readonly:true,
                placeholder:"receipt date will appear here",
			},
            {
				id:"receipt_time",
				view:"text",
                readonly:true,
                placeholder:"receipt time will appear here",
			},
	    ]
	},
    {
        cols:[
            {

                    id:"payment_system",
                    view:"text",
                    readonly:true,
                    placeholder:"payment system will appear here",
                    width:300
            },{}
        ]
    },
	]

}
