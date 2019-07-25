function mySubmit(){
	if ($$("get_product_form").validate()){ //validate form
		var fparam = $$("get_product_form").getValues();
		sum = parseInt(fparam.quantity) + parseInt(fparam.order_qty);
		console.log(sum);
		console.log(fparam.max_stock);
		if (sum<=fparam.max_stock) {
			$$("pop_datatable").add(fparam);
			$$("get_product").focus();
			$$("get_product_window").hide();
		}else{
			webix.message('Take note:<br>'+fparam.name+' stock has risen above maximum stock level.','error');
			$$("pop_datatable").add(fparam);
			$$("get_product").focus();
			$$("get_product_window").hide();
		}
	}else{
		webix.message({ type:"error", text:"Form data is invalid"});
	}
}

var product_form = {
	id:"product_form",
	view:"form",
	borderless:true,
	elements: [
		{ view:"text", label:'Name', name:"name" },
        { view:"combo", label:'Category', name:"category",
		options:[] },
        {
            cols:[
                { view:"counter", step:0.5,label:'Cost Price', name:"cp",min:0 },
                { view:"counter", step:0.5,label:'Selling Price', name:"sp",min:0 },
            ]
        },
        {
            cols:[
                {view:"counter", step:10,label:'Minimum Stock', name:"min_stock",min:0 },
                { view:"counter", step:10,label:'Maximum Stock', name:"max_stock",min:0 },
            ]
        },
        {
            cols:[
                { view:"text", label:'Unit of measure', name:"unit_of_measure" },
                { view:"text", label:'Code', name:"code" },
            ]
        },
        { view:"text", label:'Description', name:"desc" },
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("product_form").getValues();
				uri = "/inventory/apiv1/create/product";
				webix.ajax().post(uri,fparam
					, function(text,response) {

					msg = response.json();
                    console.log(msg);
					if (msg.status){
						webix.message(msg.msg);
						var product_list = $$("get_product").getPopup().getList();
					    product_list.clearAll();
					    product_list.load("/inventory/apiv1/helpers/getproductidface",function(){
							$$("product_window").hide(); //hide window
						});
					}else{
						webix.message(msg.msg,'error');

					}
				});

            }
			else{
				webix.message({ type:"error", text:"Form data is invalid" });
			}
		}}
	],
	elementsConfig:{
		labelPosition:"top",
	}
};

var get_supplier_form = {
	id:"get_supplier_form",
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
    				view:"button", label:"Cancel", click:("$$('get_supplier_window').hide();"),align:"right"
    			},
                { view:"button", value: "Submit", click:function(){
						if ($$("get_supplier_form").validate()) {
							fparam = $$("get_supplier_form").getValues();
							url = "/supplier/apiv1/create/supplier";
							webix.ajax().post(url,fparam,function(text,resp){
								msg = resp.json();
								if (msg.status) {
									webix.message("New Supplier created successfully");
									var supplier_list = $$("get_supplier").getPopup().getList();
								    supplier_list.clearAll();
								    supplier_list.load("/supplier/apiv1/helpers/getsupplieridface");
									$$("get_supplier_window").hide();
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
					$$("get_product_form").elements.comment.focus();
				}
			}
		},
		{
			view:"text",
			label:"Comment",
			name:"comment",
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

var product_window = {
    view:"window",
    id:"product_window",
    width:300,
    position:"center",
    modal:true,
    head:{
		cols:[
			{
				template:"Product Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('product_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(product_form)
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
				template:"Point of Purchase",
				type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('get_product_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(get_product_form)
};

var get_supplier_window = {
    view:"window",
    id:"get_supplier_window",
    width:350,
    position:"center",
    modal:true,
    head:{
		cols:[
			{
				template:"New Supplier Form",
				type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('get_supplier_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(get_supplier_form)
};

var get_product = {
    padding:20,
	rows:[
		{
		cols:[
	        {
				gravity:7,
	            id:"get_product",
	            view:"combo",
	            placeholder:"Scan or Search for product here ...",
	            options:[],
	            on:{
	                onChange:function(){
	                    if ($$("get_product").getValue()=="") {
	                        webix.message("I don't care about this change");
	                    }else{
	                        webix.message("Change has come");
	                        id = $$("get_product").getValue();
	                        webix.message(id);
	                        $$("get_product").setValue("");
	                        uri = "/inventory/apiv1/query/product/"+id
	                        webix.ajax().post(uri,function(text,response) {
	                        	// console.log(text);
	                        	// console.log(response);
	                        	data = response.json();
	                            console.log(data);
								datatable = $$("pop_datatable").getItem(data.id);
								console.log(datatable);
								if (data.status) {
									if (datatable) {
										$$("pop_datatable").editCell(data.id,"order_qty",false,true);
									}else{

									   $$("get_product_window").getBody().clear();
									   $$("get_product_window").show();
									   $$("get_product_form").parse(data);
									   $$("get_product_window").getBody().elements.order_qty.focus();
									}
								}else{
									webix.message("this product no longer exists","error");
									var product_list = $$("get_product").getPopup().getList();
								    product_list.clearAll();
								    product_list.load("/inventory/apiv1/helpers/getproductidface");
								}


	                        }).fail(function (xhr) {
	                            // var response = JSON.parse(xhr.response);
	                            webix.message('something went wrong, try refreshing the page','error');
	                        });
	                    }
	                }
	            }
	        },
			{
				gravity:3,
				id:"get_supplier",
				view:"combo",
				placeholder:"Search supplier here ...",
				options:[
					"supplier 1",
					"supplier 2",
					"supplier 3"
				]
			}
	    ]
	},
	{
		padding:5,
		cols:[
			{
				view:"button",
				label:"Create New Product",
				type:"iconButton",
				icon:"plus",
				autowidth:true,
				click:function(){
					$$("product_window").getBody().clear();
					$$("product_window").show();
					$$("product_window").getBody().focus();
				}
			},
			{
				id:"get_receipt",
				view:"text",
				placeholder:"Enter receipt number here",

			},
			{
				gravity:1,
				id:"get_payment_system",
				width:350,
				view:"combo",
				placeholder:"Select Payment System ...",
				options:[]
			},
			{},
			{
				view:"button",
				label:"Create New Supplier",
				type:"iconButton",
				icon:"user-plus",
				autowidth:true,
				click:function(){
					$$("get_supplier_window").getBody().clear();
					$$("get_supplier_window").show();
					$$("get_supplier_window").getBody().focus();
				}
			}

		]
	}
	]

}
