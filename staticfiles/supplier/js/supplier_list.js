
var supplier_form = {
	doIeditID:null,
	doIedit:false,
	id:"supplier_form",
	view:"form",
	borderless:true,
    elements: [
		{ view:"text", label:'Supplier Name', name:"name"},
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
    				view:"button", label:"Cancel", click:("$$('supplier_window').hide();"),align:"right"
    			},
                { view:"button", value: "Submit", click:function(){
						if ($$("supplier_form").validate()) {
							fparam = $$("supplier_form").getValues();

							if ($$("supplier_form").doIedit) {
								url = "/supplier/apiv1/update/supplier/"+fparam.id;
							}else{
								url = "/supplier/apiv1/create/supplier";
							}
							webix.ajax().post(url,fparam,function(text,resp){
								msg = resp.json();
								if (msg.status) {
									webix.message("New Supplier created successfully");
									$$("supplier_dt").load("/supplier/apiv1/query/suppliers");
								    if ($$("supplier_form").doIedit) {
								    	$$("supplier_dt").showItem(fparam.id);
										$$("supplier_dt").select(fparam.id);
								    }else{
								    	$$("supplier_dt").showItem(msg.object_id);
										$$("supplier_dt").select(msg.object_id);
								    }
									$$("supplier_window").hide();
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

var supplier_window = {
    view:"window",
    id:"supplier_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Supplier Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('supplier_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(supplier_form)
};

var supplier_btn = {
    cols:[
        {
            view:"button",
            label:"New Supplier",
            type:"iconButton",
            icon:"plus",
            autowidth:true,
            click:function(){
				$$("supplier_window").getBody().clear();
                $$("supplier_window").show();
				$$("supplier_form").doIedit=false;
                $$("supplier_window").getBody().focus();
            }
        },
        {
            view:"button",
            label:"Edit Supplier",
            type:"iconButton",
            icon:"edit",
            autowidth:true,
            click:function(){
                var prc = $$("supplier_dt").getSelectedItem();
                if (prc){
					console.log(prc);
					$$("supplier_window").getBody().clear();
	                $$("supplier_window").show();
					$$("supplier_form").parse(prc);
					$$("supplier_form").doIedit=true;
					$$("supplier_form").doIeditID=prc.id;
	                $$("supplier_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Delete Supplier",
            type:"iconButton",
            icon:"trash",
            autowidth:true,
            click:function(){
                var prc = $$("supplier_dt").getSelectedItem();
				if (prc){
					webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this ",
						type:"confirm-warning",
						callback:function(result){
							if (result) {
                                uri = "/supplier/apiv1/delete/supplier/";
								webix.ajax().post(uri+prc.id,function(text,response){
									msg = response.json();
									if (msg.status){
										$$("supplier_dt").remove(prc.id);
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
            label:"Supplier's Details",
            type:"iconButton",
            icon:"eye",
            autowidth:true,
            click:function(){
				selected_supplier = $$('supplier_dt').getSelectedItem();
				// console.log(selected_supplier);
				if (!selected_supplier) {
					webix.message("No Supplier Selected")
				}else{
					uri = "/supplier/apiv1/helpers/purchases";
					webix.ajax().get(uri,selected_supplier,function(text,response){
						resp = response.json();
						$$('purchases_view_dt').clearAll();
						$$('purchases_return_view_dt').clearAll();
						$$('purchases_view_dt').parse(resp.purchases);
						$$('purchases_return_view_dt').clearAll(resp.pr);
					});

	                $$('supplier_detail_window').show();
				}

            }
        },
        {}
    ]
}

var supplier_dt = {
    id:"supplier_dt",
    view: "datatable",
    select:"row",
	url:"/supplier/apiv1/query/suppliers",
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

var supplier_list = {
    // header:"Suppliers",
    // body:{
        type:"space",
        rows:[
            supplier_btn,
            supplier_dt,
        ]
    // }
}
