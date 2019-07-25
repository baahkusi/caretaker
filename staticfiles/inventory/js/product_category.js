var product_category_form = {
	doIeditID:null,
	doIedit:false,
	id:"product_category_form",
	view:"form",
	borderless:true,
	elements: [
		{ view:"text", label:'Name', name:"name" },
		// { view:"text", label:'Description', name:"desc" },
        // { view:"text", label:'Code', name:"code" },
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("product_category_form").getValues();
				if ($$("product_category_form").doIedit) {
					id = $$("product_category_form").doIeditID;
					uri = "/inventory/apiv1/update/category/"+id;
				}else{
					uri = "/inventory/apiv1/create/category";
				}

				webix.ajax().post(uri,fparam
					, function(text,response) {
					// console.log(text);
					// console.log(response);
					msg = response.json();
					if (msg.status){
						webix.message(msg.msg);
						$$("product_category_datatable").load("/inventory/apiv1/query/categorys",function(){
							$$("product_category_window").hide(); //hide window
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

var product_category_window = {
    view:"window",
    id:"product_category_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Product Category Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('product_category_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(product_category_form)
};

var product_category_actions = {
    // padding:5,
    cols:[

        {
            view:"button",
            label:"Add Category",
            type:"iconButton",
            icon:"plus",
            autowidth:true,
            click:function(){
					$$("product_category_window").getBody().clear();
	                $$("product_category_window").show();
					$$("product_category_form").doIedit=false;
	                $$("product_category_window").getBody().focus();


            }
        },
        {
            view:"button",
            label:"Edit Category",
            type:"iconButton",
            icon:"edit",
            autowidth:true,
            click:function(){
                var prc = $$("product_category_datatable").getSelectedItem();
                if (prc){
					console.log(prc);
					$$("product_category_window").getBody().clear();
	                $$("product_category_window").show();
					$$("product_category_form").parse(prc);
					$$("product_category_form").doIedit=true;
					$$("product_category_form").doIeditID=prc.id;
	                $$("product_category_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Delete Category",
            type:"iconButton",
            icon:"trash",
            autowidth:true,
            click:function(){
                var prc = $$("product_category_datatable").getSelectedItem();
				if (prc){
					webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this category",
						type:"confirm-warning",
						callback:function(result){
							if (result) {
								webix.ajax().post("/inventory/apiv1/delete/category/"+prc.id,function(text,response){
									msg = response.json();
									if (msg.status){
										$$("product_category_datatable").remove(prc.id);
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
        },{}
    ]
}

var product_category_datatable = {
    // padding:10,
    cols:[
        {
            view: "datatable",
            id:"product_category_datatable",
            url:"/inventory/apiv1/query/categorys",
            select:"row",
            columns:[
                {id:"id", header:"#", width:50,hidden:false},
                // {id:"code", header:"Category Code", width:100,fillspace:2},
                {id:"name", header:"Category Name", width:100,fillspace:3},
                // {id:"desc", header:"Category Description", width:100,fillspace:5},
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

var product_category = {
    header: "Products Category",
    body: {
        type:"space",
        rows:[
            product_category_actions,
            product_category_datatable,
        ]
    }
}
