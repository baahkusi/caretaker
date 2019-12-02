var systems_form = {
	doIeditID:null,
	doIedit:false,
	id:"systems_form",
	view:"form",
	borderless:true,
	elements: [
		{ view:"text", label:'Name', name:"system" },
        { view:"text", label:'Currency', name:"currency" },
        { view:"text", label:'Comment', name:"comment" },
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("systems_form").getValues();
				if ($$("systems_form").doIedit) {
					id = $$("systems_form").doIeditID;
					uri = "/cash/apiv1/update/cash/"+id;
				}else{
					uri = "/cash/apiv1/create/cash";
				}

				webix.ajax().post(uri,fparam
					, function(text,response) {

					msg = response.json();
                    // console.log(msg);
					if (msg.status){
						$$("systems_datatable").load("/cash/apiv1/query/cashs",function(){
							$$("systems_window").hide(); //hide window
							$$("systems_datatable").showItem(fparam.id);
							$$("systems_datatable").select(fparam.id);
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

var systems_balance_form_inc = {
	doIincreaseID:null,
	doIincrease:true,
	id:"systems_balance_form_inc",
	view:"form",
	borderless:true,
	elements: [
		{
			view:"counter", step:10,label:"Increase Balance By", name:"amount",min:0,value:0
		},
        {
			view:"text", label:'Why the Change', name:"say"
		},
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("systems_balance_form_inc").getValues();
				uri = "/cash/apiv1/create/increment";
				fparam['cash'] = fparam.id;
				fparam['comment'] = fparam.say;
				webix.ajax().post(uri,fparam
					, function(text,response) {

					msg = response.json();
                    console.log(msg);
					if (msg.status){
						webix.message(msg.msg);
						$$("systems_datatable").load("/cash/apiv1/query/cashs",function(){
							$$("systems_window_inc").hide(); //hide window
							$$("systems_datatable").showItem(fparam.id);
							$$("systems_datatable").select(fparam.id);
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

var systems_balance_form_dec = {
	doIincreaseID:null,
	doIincrease:true,
	id:"systems_balance_form_dec",
	view:"form",
	borderless:true,
	elements: [
		{
			view:"counter", step:10,label:"Decrease Balance By", name:"amount",min:0,value:0
		},
        {
			view:"text", label:'Why the Change', name:"say"
		},
		{ view:"button", value: "Submit", click:function(){
			if (this.getParentView().validate()){ //validate form
				var fparam = $$("systems_balance_form_dec").getValues();
				uri = "/cash/apiv1/create/decrement";
				fparam['cash'] = fparam.id;
				fparam['comment'] = fparam.say;
				webix.ajax().post(uri,fparam
					, function(text,response) {

					msg = response.json();
                    console.log(msg);
					if (msg.status){
						webix.message(msg.msg);
						$$("systems_datatable").load("/cash/apiv1/query/cashs",function(){
							$$("systems_window_dec").hide(); //hide window
							$$("systems_datatable").showItem(fparam.id);
							$$("systems_datatable").select(fparam.id);
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

var systems_window = {
    view:"window",
    id:"systems_window",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Payment System Form",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('systems_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(systems_form)
};

var systems_window_inc = {
    view:"window",
    id:"systems_window_inc",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Set Balance",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('systems_window_inc').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(systems_balance_form_inc)
};

var systems_window_dec = {
    view:"window",
    id:"systems_window_dec",
    width:300,
    position:"center",
	move:true,
    head:{
		cols:[
			{
				template:"Set Balance",
				// type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('systems_window_dec').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(systems_balance_form_dec)
};

var systems_btn = {
    cols:[
        {
            view:"button",
            label:"New Currency",
            type:"iconButton",
            icon:"plus",
            autowidth:true,
            click:function(){
				$$("systems_window").getBody().clear();
                $$("systems_window").show();
				$$("systems_form").doIedit=false;
                $$("systems_window").getBody().focus();
            }
        },
        {
            view:"button",
            label:"Edit System",
            type:"iconButton",
            icon:"edit",
            autowidth:true,
            click:function(){
                var prc = $$("systems_datatable").getSelectedItem();
                if (prc){
					console.log(prc);
					$$("systems_window").getBody().clear();
	                $$("systems_window").show();
					$$("systems_form").parse(prc);
					$$("systems_form").doIedit=true;
					$$("systems_form").doIeditID=prc.id;
	                $$("systems_window").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Delete System",
            type:"iconButton",
            icon:"trash",
            autowidth:true,
            click:function(){
                var prc = $$("systems_datatable").getSelectedItem();
				if (prc){
					webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this ",
						type:"confirm-warning",
						callback:function(result){
							if (result) {
                                uri = "/cash/apiv1/delete/cash/";
								webix.ajax().post(uri+prc.id,function(text,response){
									msg = response.json();
									if (msg.status){
										$$("systems_datatable").remove(prc.id);
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
            label:"Increase Balance",
            type:"iconButton",
            icon:"arrow-up",
            autowidth:true,
            click:function(){
                var prc = $$("systems_datatable").getSelectedItem();
				if (prc){
					$$("systems_window_inc").getBody().clear();
	                $$("systems_window_inc").show();
					$$("systems_balance_form_inc").parse(prc);
					$$("systems_balance_form_inc").doIincrease=true;
	                $$("systems_window_inc").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {
            view:"button",
            label:"Decrease Balance",
            type:"iconButton",
            icon:"arrow-down",
            autowidth:true,
            click:function(){
                var prc = $$("systems_datatable").getSelectedItem();
				if (prc){
					$$("systems_window_dec").getBody().clear();
	                $$("systems_window_dec").show();
					$$("systems_balance_form_dec").parse(prc);
					$$("systems_balance_form_dec").doIincrease=false;
	                $$("systems_window_dec").getBody().focus();
				}else{
					webix.message("No row is selected","error");
					webix.message("Select a row by clicking on it");
				}
            }
        },
        {}
    ]
}

var systems_dt = {
    // padding:10,
    cols:[
        {
            view: "datatable",
            id:"systems_datatable",
            url:"/cash/apiv1/query/cashs",
            footer:true,
            select:"row",
            columns:[
                {id:"id", header:"#",hidden:false},
                {id:"system", header:"Payment System",sort:"text",fillspace:2,footer:"Total Balance : "},
                {id:"currency", header:"Currency",sort:"int",fillspace:2},
                {id:"balance", header:"Balance",footer:{content:"summColumn"},sort:"int",fillspace:2},
                {id:"comment", header:"Comment",sort:"int",fillspace:5},
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

var systems = {
    header:"Payment Systems",
    body:{
		type:"space",
        rows:[
            systems_btn,
            systems_dt
        ]
    }
}
