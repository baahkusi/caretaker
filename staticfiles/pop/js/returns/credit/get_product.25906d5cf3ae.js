function load_invoice_items(){
    var invoice_number = $$("load_invoice").getValue();
    invoice_number = invoice_number.replace(/ /gi,"");
    if (invoice_number) {
        uri = "/invoice/apiv1/helpers/recall/purchases";
        webix.ajax().get(uri,{number:invoice_number},function(text,response){
            msg = response.json();
            // console.log(msg);
            if (msg.status) {
                $$("pop_datatable").clearAll();
                $$("pop_datatable").parse(msg.r_objects);
                $$("invoice_date").setValue(msg.q_objects.date);
                $$("invoice_time").setValue(msg.q_objects.time);
                $$("invoice_id").setValue(msg.q_objects.id);
            }else{
                switch (msg.code) {
                    case "600":
                        webix.message("This invoice has already been returned.I can't return a invoice twice","error");
                        webix.alert("This invoice has already been returned.I can't return a invoice twice","alert-error");
                        break;
                    case "000":
                        webix.message("This invoice is voided and no longer holds any effect, I can't return a voided invoice","error");
                        webix.alert("This invoice is voided and no longer holds any effect, I can't return a voided invoice","alert-error");
                        break;
                    default:
                    webix.message("Invalid Receipt Number","error");
                    webix.alert("Invalid Receipt Number","alert-error");
                }

            }
        });
    }else{
        webix.message("Please Enter a Receipt Number","error");
        $$("load_invoice").focus();
    }
}

var load_invoice = {
    padding:20,
	rows:[
		{
		cols:[
			{
				id:"load_invoice",
				view:"text",
				placeholder:"Enter Receipt Number Here ...",
                on:{
                    onEnter:function(){
                        load_invoice_items();
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
                    load_invoice_items();
                }
			},
            {},
            {
				id:"invoice_id",
				view:"text",
                readonly:true,
                hidden:true,
			},
            {
				id:"invoice_date",
				view:"text",
                readonly:true,
                placeholder:"purchases invoice date will appear here ...",
			},
            {
				id:"invoice_time",
				view:"text",
                readonly:true,
                placeholder:"purchases invoice time will appear here ...",
			},
	    ]
	}
	]

}
