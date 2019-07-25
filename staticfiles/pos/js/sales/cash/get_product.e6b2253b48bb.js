function mySubmit(){
	if ($$("get_product_form").validate()){ //validate form
		var fparam = $$("get_product_form").getValues();
		console.log(fparam);
		diff = fparam.quantity - fparam.order_qty+1;
		if (diff>0) {
			if (diff>fparam.min_stock) {
				$$("pos_datatable").add(fparam);
				$$("get_product").focus();
				$$("get_product_window").hide();
			}else{
				webix.message('Take note:<br>'+fparam.name+' stock has fallen below minimum stock level.','error');
				$$("pos_datatable").add(fparam);
				$$("get_product").focus();
				$$("get_product_window").hide();
			}
		}else{
			webix.message('Can\'t proceed because quantity on hand is not enough to satisfy this order','error');
			webix.message('If you think that is not the case cancel and try again');
		}

	}
	else{
		webix.message({ type:"error", text:"Form data is invalid"});
	}
}

var customer_form = {
	doIeditID:null,
	doIedit:false,
	id:"customer_form",
	view:"form",
	borderless:true,
    elements: [
		{ view:"text", label:'Customer Name', name:"name"},
		{ view:"text", label:'Email', name:"email"},
		{
			cols:[
				{ view:"text", label:'Phone 1', name:"phone_primary"},
				{ view:"text", label:'Phone 2', name:"phone_secondary"},
			]
		},
		{view:"text",label:"Address",name:"address"},
		{
			cols:[
				{
				    view:"richselect",
				    label:"Region",
				    value:1,
				    yCount:"3",
				    options:[
				        "Greater Accra",
						"Central",
						"Upper West",
						"Upper East",
						"Northen",
						"Ashanti",
						"Eastern",
						"Volta",
						"Brong-Ahafo",
						"Western"
				    ]
				},
				{view:"text",label:"City",name:"city"},
			]
		},
		{view:"text",label:"Ghana Post GPS",name:"ghpgps"},
		{view:"text",label:"Comment",name:"comment"},
        {
            cols:[
                {
    				view:"button", label:"Cancel", click:("$$('customer_window').hide();"),align:"right"
    			},
                { view:"button", value: "Submit", click:function(){
						if ($$("customer_form").validate()) {
							fparam = $$("customer_form").getValues();
							url = "/customer/apiv1/create/customer";
							webix.ajax().post(url,fparam,function(text,resp){
								msg = resp.json();
								if (msg.status) {
									webix.message("New Customer created successfully");
									var customer_list = $$("get_customer").getPopup().getList();
								    customer_list.clearAll();
								    customer_list.load("/customer/apiv1/helpers/getcustomeridface");
									$$("customer_window").hide();
								} else {
									webix.message(msg.msg,"error")
								}
							}).fail(function(){
									webix.message("Something went wrong please try agian or refresh and try again","error");
							});
						}else{
							webix.message("Invalid Email","error");
						}
					}
                }
            ]
        }
    ],
	elementsConfig:{
		labelPosition:"top",
	}
};

var customer_window = {
    view:"window",
    id:"customer_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Customer Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('customer_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(customer_form)
};

var get_product_form = {
	id:"get_product_form",
	view:"form",
	borderless:true,
	elements: [
        { view:"text", label:'ID', name:"id",hidden:true,disabled:true,readonly:true},
		{ view:"text", label:'Product', name:"name",readonly:true,value:"My text",disabled:true},
        { view:"text", label:'Stock on Hand', name:"quantity",disabled:true,readonly:true},
        { view:"text", label:'CP', name:"cp",readonly:true,hidden:true,disabled:true},
        { view:"text", label:'Price (GH&#8373;)', name:"sp",disabled:true,readonly:true},
        { view:"text", label:'Code', name:"code",disabled:true,readonly:true,hidden:true},
        {
			view:"counter",
			step:1,label:"Qty",
			name:"order_qty",
			min:1,
			on:{
				onEnter:function(){
					mySubmit();
				}
			}
		},
        {
            cols:[
                {
    				view:"button", label:"Cancel", click:("$$('get_product_window').hide();"),align:"right"
    			},
                { view:"button", value: "Submit", click:mySubmit
                }
            ]
        }
	],
	elementsConfig:{
		labelPosition:"top",
	},
};

var get_product_window = {
    view:"window",
    id:"get_product_window",
    width:300,
    position:"top",
    modal:true,
    head:{
		cols:[
			{
				template:"Point of Sale",
				type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('get_product_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(get_product_form)
};

var get_product = {
    padding:20,
	rows:[
		{
		cols:[
			{
				gravity:3,
				id:"get_customer",
				view:"text",
				placeholder:"Customer Name ...",
				on:{
					onEnter:function(){
						var cute = $$("get_customer").getValue();
						if (cute == "") {
							webix.message("Enter Customer Name ...");
						}else {
							$$("get_product").focus();
						}
					}
				}
			},
	        {
				gravity:7,
	            id:"get_product",
	            view:"combo",
	            placeholder:"Scan or Search for product here ...",
	            options:[],
	            on:{
	                onChange:function(){
	                    if ($$("get_product").getValue()=="") {
	                        // webix.message("I don't care about this change");
	                    }else{
	                        // webix.message("Change has come");
	                        id = $$("get_product").getValue();
	                        // webix.message(id);
	                        $$("get_product").setValue("");
	                        uri = "/inventory/apiv1/query/product/"+id
	                        webix.ajax().post(uri,function(text,response) {
	                        	// console.log(text);
	                        	// console.log(response);
	                        	data = response.json();
	                            console.log(data);
								datatable = $$("pos_datatable").getItem(data.id);
								console.log(datatable);
								if (datatable) {
									$$("pos_datatable").editCell(data.id,"order_qty",false,true);
								}else{
									if (data.quantity<data.min_stock) {
										webix.confirm({
											title:"Minimum Stock Level Warning",
											text:data.name+" current stock on hand "+data.quantity+data.unit_of_measure+" is below minimum level "+data.min_stock+data.unit_of_measure+" do you still want to continue",
											ok:"Yes",cancel:"No",
											type:"confirm-warning",
											callback:function(result){
												if (result) {
												 	$$("get_product_window").getBody().clear();
							    	                $$("get_product_window").show();
							    					$$("get_product_form").parse(data);
							    	             	$$("get_product_window").getBody().elements.order_qty.focus();
												} else {
													webix.message('Cancelled ...','error');
													$$("get_product").focus();
												}
											}
										});
									} else {
										   $$("get_product_window").getBody().clear();
										   $$("get_product_window").show();
										   $$("get_product_form").parse(data);
										   $$("get_product_window").getBody().elements.order_qty.focus();
									}
								}
	                        }).fail(function (xhr) {
	                            // var response = JSON.parse(xhr.response);
	                            webix.message('something went wrong, try refreshing the page','error');
	                        });
	                    }
	                }
	            }
	        },
	    ]
	},
	{
		padding:5,
		cols:[
			{
				gravity:1,
				id:"get_payment_system",
				width:350,
				view:"combo",
				placeholder:"Select Payment System ...",
				options:[]
			},
			{},
			// {
			// 	view:"button",
			// 	label:"Create New Customer",
			// 	type:"iconButton",
			// 	icon:"user-plus",
			// 	autowidth:true,
			// 	click:function(){
			// 		$$("customer_window").getBody().clear();
			// 		$$("customer_window").getBody().focus();
			// 		$$("customer_window").show();
			// 	}
			// }

		]
	}
	]

}
