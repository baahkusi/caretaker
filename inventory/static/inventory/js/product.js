
var product_form = {
	doIeditID:null,
	doIedit:false,
	id:"product_form",
	view:"form",
	borderless:true,
	elements: [
		{ view:"text", label:'Name', name:"name" },
        { view:"combo", label:'Category', name:"category",
		options:"/inventory/apiv1/helpers/getcategoryidface" },
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
                // { view:"text", label:'Code', name:"code" },
            ]
        },
        // { view:"text", label:'Description', name:"desc" },
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("product_form").getValues();
				if ($$("product_form").doIedit) {
					id = $$("product_form").doIeditID;
					uri = "/inventory/apiv1/update/product/"+id;
				}else{
					uri = "/inventory/apiv1/create/product";
				}

				webix.ajax().post(uri,fparam
					, function(text,response) {

					msg = response.json();
                    // console.log(msg);
					if (msg.status){
						webix.message(msg.msg);
						$$("product_datatable").load("/inventory/apiv1/query/products",function(){
							$$("product_window").hide(); //hide window
							if ($$("product_form").doIedit) {
								$$("product_datatable").showItem(msg.object_id);
								$$("product_datatable").select(msg.object_id);
							}else{
								$$("product_datatable").showItem(fparam.id);
								$$("product_datatable").select(fparam.id);
							}
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


var product_quantity_form = {
	doIincreaseID:null,
	doIincrease:true,
	id:"product_quantity_form",
	view:"form",
	borderless:true,
	elements: [
		{ view:"text", label:'Product', name:"id",hidden:true },
        {
            cols:[
                { view:"counter", step:0.5,label:'Cost Price', name:"cp",min:0 },
                { view:"counter", step:0.5,label:'Selling Price', name:"sp",min:0 },
            ],
			hidden:true
        },
		{
			view:"counter", step:10,label:"Alter Quantity By", name:"quantity",min:0,value:0
		},
        {
			view:"combo", label:'Why the Change', name:"comment",
			options:["initial","missing","expired","gift","other"]
		},
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("product_quantity_form").getValues();
				if ($$("product_quantity_form").doIincrease) {
					uri = "/inventory/apiv1/create/increment";
				}else{
					uri = "/inventory/apiv1/create/decrement";
				}
				// set product_name for increment sake
				fparam['product_name'] = fparam['name'];
				webix.ajax().post(uri,fparam
					, function(text,response) {

					msg = response.json();
                    console.log(msg);
					if (msg.status){
						webix.message(msg.msg);
						$$("product_datatable").load("/inventory/apiv1/query/products",function(){
							$$("product_quantity_window").hide(); //hide window
							$$("product_datatable").showItem(fparam.id);
							$$("product_datatable").select(fparam.id);
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

var product_window = {
    view:"window",
    id:"product_window",
    width:300,
    position:"center",
	move:true,
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

var product_quantity_window = {
    view:"window",
    id:"product_quantity_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Product Quantity Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('product_quantity_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(product_quantity_form)
};

var product_actions = {
    // padding:5,
    cols:[

        {
            view:"button",
            label:"Add Product",
            type:"iconButton",
            icon:"plus",
            autowidth:true,
            click:function(){
					$$("product_window").getBody().clear();
	                $$("product_window").show();
					$$("product_form").doIedit=false;
	                $$("product_window").getBody().focus();


            }
        },
        {
            view:"button",
            label:"Edit Product",
            type:"iconButton",
            icon:"edit",
            autowidth:true,
            click:function(){
                var prc = $$("product_datatable").getSelectedItem();
                if (prc){
					console.log(prc);
					$$("product_window").getBody().clear();
	                $$("product_window").show();
					$$("product_form").parse(prc);
					$$("product_form").doIedit=true;
					$$("product_form").doIeditID=prc.id;
	                $$("product_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Delete Product",
            type:"iconButton",
            icon:"trash",
            autowidth:true,
            click:function(){
                var prc = $$("product_datatable").getSelectedItem();
				if (prc){
					webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this ",
						type:"confirm-warning",
						callback:function(result){
							if (result) {
								webix.ajax().post("/inventory/apiv1/delete/product/"+prc.id,function(text,response){
									msg = response.json();
									if (msg.status){
										$$("product_datatable").remove(prc.id);
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
            label:"Increase Product Qty",
            type:"iconButton",
            icon:"arrow-up",
            autowidth:true,
            click:function(){
                var prc = $$("product_datatable").getSelectedItem();
				if (prc){
					$$("product_quantity_window").getBody().clear();
	                $$("product_quantity_window").show();
					$$("product_quantity_form").parse(prc);
					$$("product_quantity_form").doIincrease=true;
	                $$("product_quantity_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Decrease Product Qty",
            type:"iconButton",
            icon:"arrow-down",
            autowidth:true,
            click:function(){
                var prc = $$("product_datatable").getSelectedItem();
				if (prc){
					$$("product_quantity_window").getBody().clear();
	                $$("product_quantity_window").show();
					$$("product_quantity_form").parse(prc);
					$$("product_quantity_form").doIincrease=false;
	                $$("product_quantity_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
		}
		,{},
		// {
		// 	view:"button",
        //     label:"Reset Stock / Inventory Level",
        //     type:"iconButton",
        //     icon:"recycle",
        //     autowidth:true,
        //     click:function(){
        //         webix.confirm({
		// 			title: "Stock / Inventory Reset Warning",
		// 			ok:"Yes", cancel:"No",
		// 			text:"You are about to reset all stock / inventory level to zero ( 0 ). <br>Are you sure you want to continue with this action ?",
		// 			type:"confirm-warning",
		// 			callback:function(result){
		// 				if (result) {
		// 					webix.confirm({
		// 						title: "Stock / Inventory Reset Final Warning",
		// 						ok:"Yes", cancel:"No",
		// 						text:"Any quantity you've entered would be cleared and reset to Zero ( 0 ). <br>Are you sure you want to continue with this action ?",
		// 						type:"confirm-error",
		// 						callback:function(result){
		// 							if (result) {
		// 								url = '/inventory/apiv1/resets/inventory';
		// 								$$('product_datatable').clearAll();
		// 								$$('product_datatable').showOverlay('<b>Reset Operation Pending ...</b>');
		// 								webix.ajax().post(url,function(txt,res){
		// 									msg = res.json();
		// 									if (msg.status) {
		// 										$$("product_datatable").load("/inventory/apiv1/query/products");
		// 									}else{
		// 										webix.message('Action Failed','error');
		// 									}
		// 								});
		// 							}else{
		// 								webix.message('Action Aborted','error');
		// 							}
		// 						}
		// 					});
		// 				}else{
		// 					webix.message('Action Aborted','error');
		// 				}
		// 			}
		// 		});
        //     }
		// },
    ]
}

var product_datatable = {
    // padding:10,
    cols:[
        {
            view: "datatable",
            id:"product_datatable",
            url:"/inventory/apiv1/query/products",
            select:"row",
            columns:[
                {id:"id", header:"#",hidden:false},
                {id:"name",header:[ "Product",{content:"textFilter"}],sort:"text",fillspace:2},
                {id:"cp", header:["Unit C.P.  GH&#8373;",{content:"numberFilter"}],sort:"int",fillspace:2},
                {id:"sp", header:["Unit S.P.  GH&#8373;",{content:"numberFilter"}],sort:"int",fillspace:2},
                {id:"quantity", header:" Qty",sort:"int"},
                {id:"category_id", header:["Category",{content:"selectFilter"}],sort:"text",fillspace:2},
                // {id:"code", header:"Code"},
                {id:"min_stock", header:"Min O.L.",sort:"int"},
                {id:"max_stock", header:"Max O.L.",sort:"int"},
                {id:"unit_of_measure", header:"Unit"},
                // {id:"desc", header:"Description",fillspace:5},
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
    ]
}

var product= {
    header: "Products",
    body: {
        type:"space",
        rows:[
            product_actions,
            product_datatable,
        ]
    }
}
