
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
							if ($$("customer_form").doIedit) {
								url = "/customer/apiv1/update/customer/"+fparam.id;
							}else{
								url = "/customer/apiv1/create/customer";
							}

							webix.ajax().post(url,fparam,function(text,resp){
								msg = resp.json();
								if (msg.status) {
									webix.message("New Customer created successfully");
								    $$("customer_dt").load("/customer/apiv1/query/customers");
								    if ($$("customer_form").doIedit) {
								    	$$("customer_dt").showItem(fparam.id);
										$$("customer_dt").select(fparam.id);
								    }else{
								    	$$("customer_dt").showItem(msg.object_id);
										$$("customer_dt").select(msg.object_id);
								    }

									$$("customer_window").hide();
								} else {
									webix.message(msg.msg,"error")
								}
							}).fail(function(){
								webix.message("Invalid data, check your inputs and submit again","error");
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

var customer_btn = {
    cols:[
        {
            view:"button",
            label:"New Customer",
            type:"iconButton",
            icon:"plus",
            autowidth:true,
            click:function(){
				$$("customer_window").getBody().clear();
                $$("customer_window").show();
				$$("customer_form").doIedit=false;
                $$("customer_window").getBody().focus();
            }
        },
        {
            view:"button",
            label:"Edit Customer",
            type:"iconButton",
            icon:"edit",
            autowidth:true,
            click:function(){
                var prc = $$("customer_dt").getSelectedItem();
                if (prc){
					console.log(prc);
					$$("customer_window").getBody().clear();
	                $$("customer_window").show();
					$$("customer_form").parse(prc);
					$$("customer_form").doIedit=true;
					$$("customer_form").doIeditID=prc.id;
	                $$("customer_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Delete Customer",
            type:"iconButton",
            icon:"trash",
            autowidth:true,
            click:function(){
                var prc = $$("customer_dt").getSelectedItem();
				if (prc){
					webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this ",
						type:"confirm-warning",
						callback:function(result){
							if (result) {
                                uri = "/customer/apiv1/delete/customer/";
								webix.ajax().post(uri+prc.id,function(text,response){
									msg = response.json();
									if (msg.status){
										$$("customer_dt").remove(prc.id);
										webix.message(msg.msg);

									}else{
										webix.message(msg.msg,'error');

									}
								});
							}else{
								// console.log(result);
							}
						}
					});
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Customer's Details",
            type:"iconButton",
            icon:"eye",
            autowidth:true,
            click:function(){
				selected_customer = $$('customer_dt').getSelectedItem();
				console.log(selected_customer);
				if (!selected_customer) {
					webix.message("No Customer Selected");
				}else{
					uri = "/customer/apiv1/helpers/sales";
					webix.ajax().get(uri,selected_customer,function(text,response){
						resp = response.json();
						$$('sales_view_dt').clearAll();
						$$('sales_return_view_dt').clearAll();
						$$('sales_view_dt').parse(resp.sales);
						$$('sales_return_view_dt').clearAll(resp.sr);
					});

	                $$('customer_detail_window').show();
				}

            }
        },
        {}
    ]
}

var customer_dt = {
    id:"customer_dt",
    view: "datatable",
    select:"row",
	url:"/customer/apiv1/query/customers",
    footer:true,
    math:true,
    columns:[
        {id:"id", header:"#",hidden:true},
        {id:"name", header:["Name",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"email", header:["Email",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"phone_primary", header:["Phone 1",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"phone_secondary", header:["Phone 2",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"address", header:["Address",{content:"textFilter"}],sort:"text",fillspace:true},
        // {id:"country", header:["Country",{content:"selectFilter"}],sort:"text",fillspace:true},
        {id:"region", header:["Region",{content:"selectFilter"}],sort:"text",fillspace:true},
        // {id:"city", header:["City",{content:"textFilter"}],sort:"text",fillspace:true},
        {id:"ghpgps", header:["Ghana Post",{content:"textFilter"}],sort:"text",fillspace:true},
        // {id:"comment", header:["Comment",{content:"textFilter"}],sort:"text",fillspace:true},
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

var customer_list = {
    // header:"Customers",
    // body:{
        type:"space",
        rows:[
            customer_btn,
            customer_dt,
        ]
    // }
}
