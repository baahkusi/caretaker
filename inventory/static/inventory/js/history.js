function doAll(data){
    $$("ihistory_datatable").clearAll();
    $$("chart").clearAll();
    $$("inv_hist_dt").clearAll();
    $$("inv_inc_dt").clearAll();
    $$("inv_dec_dt").clearAll();
    $$("ihistory_datatable").parse(data.summary);
    $$("chart").parse(data.chart);
    $$("inv_hist_dt").parse(data.chart);
    $$("inv_inc_dt").parse(data.inc);
    $$("inv_dec_dt").parse(data.dec);
}

function run_date(){
    if ($$("from_date").getValue() =="" || $$("to_date").getValue() =="" ) {
        webix.message("Some Date Not Provided","error");
    } else {
        from_date = $$("from_date").getValue().split(" ");
        from_date = from_date[0];
        to_date = new Date($$("to_date").getValue());
        to_date.setDate(to_date.getDate()+1);
        to_date = to_date.toISOString().split("T")[0];
        powerview = $$("powerview").getValue();
        if (powerview == "") {
            powerview = 'all';
        }
        if (new Date(from_date)>new Date(to_date)) {
            webix.message("start date cannot be greater than end date","error");
        }else if(new Date(from_date)>new Date()){
            webix.message("Start date cannot be greater than today","error");
        }else{
            // webix.message(from_date+" "+to_date+" "+powerview);
            var dat = {b:from_date,e:to_date,p:powerview};
            var url = "/inventory/apiv1/helpers/track";
            webix.ajax().get(url,dat,function(txt,resp){
                data = resp.json();
                if (data.status) {
                    doAll(data);
                }
            });
        }
    }
}

function auto_run_date(from,to){
    powerview = $$("powerview").getValue();
    if (powerview == "") {
        powerview = 'all';
    }
    var dat = {b:from,e:to,p:powerview};
    var url = "/inventory/apiv1/helpers/track";
    webix.ajax().get(url,dat,function(txt,resp){
        data = resp.json();
        if (data.status) {
            doAll(data);
        }
    });
}


var inv_inc_dt = {
    // padding:10,
    cols:[
        {
            id: "inv_inc_dt",
            view:"datatable",
            footer:true,
            columns:[
                {id:"id", header:"",hidden:true},
                {id:"day",header:["Day (mm/dd/yyyy)",{ content:"textFilter" }],fillspace:3,format:webix.i18n.dateFormatStr},
                {id:"time", header:["Time",""]},
                {id:"quantity", header:" Qty",footer:{content:"summColumn"},sort:"int"},
                {id:"product_name", header:["Product",{content:"selectFilter"}],sort:"text",fillspace:3},
                {id:"comment", header:"Reason",fillspace:2},
            ]
        }
    ]
}

var inv_dec_dt = {
    // padding:10,
    cols:[
        {
            id: "inv_dec_dt",
            view:"datatable",
            footer:true,
            columns:[
                {id:"id", header:"",hidden:true},
                {id:"day",header:["Day (mm/dd/yyyy)",{ content:"textFilter" }],fillspace:3,format:webix.i18n.dateFormatStr},
                {id:"time", header:["Time",""]},
                {id:"quantity", header:" Qty",footer:{content:"summColumn"},sort:"int"},
                {id:"product_name", header:["Product",{content:"selectFilter"}],sort:"text",fillspace:3},
                {id:"comment", header:"Reason",fillspace:2},
            ]
        }
    ]
}

var inv_hist_dt = {
    // padding:10,
    cols:[
        {
            id: "inv_hist_dt",
            view:"datatable",
            columns:[
                {id:"day",header:["Day (mm/dd/yyyy)"],fillspace:true,format:webix.i18n.dateFormatStr},
                {id:"quantity", header:" Stock On Hand",sort:"int",fillspace:true},
            ]
        }
    ]
}

var chart = {
   view:"chart",
   id:"chart",
   type:"area",
   value:"#quantity#",
   alpha:0.5,
   color:'teal',
    item:{
            borderColor: "#ffffff",
            color: "#2b7100",
        },
    tooltip:{
            template:"#quantity#"
        },
    line:{
            color:"#8ecf03",
            width:2,
            shadow:true
        },
   xAxis:{
       template:"#day#",
       title:"day",
   },
   yAxis:{
       title:"Stock levels"
   },
}

var graph_window = {
    view:"window",
    id:"graph_window",
    position:"center",
    move:true,
    width:900,
    height:600,
    resize: true,
    head:{
		cols:[
			{
                template:"Inventory level per day for the selected period",
            },
			{
				view:"button", label:"Close", width:70, click:("$$('graph_window').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(chart)
}

var inv_inc_wind = {
    view:"window",
    id:"inv_inc_wind",
    position:"center",
    move:true,
    width:600,
    height:300,
    resize: true,
    head:{
		cols:[
			{
                template:"Causes of inventory increments",
                type:"header",
            },
			{
				view:"button", label:"Close", width:70, click:("$$('inv_inc_wind').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(inv_inc_dt)
}

var inv_dec_wind = {
    view:"window",
    id:"inv_dec_wind",
    position:"center",
    move:true,
    width:600,
    height:300,
    resize: true,
    head:{
		cols:[
			{
                template:"Causes of inventory decrements",
                type:"header"
            },
			{
				view:"button", label:"Close", width:70, click:("$$('inv_dec_wind').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(inv_dec_dt)
}

var inv_hist_wind = {
    view:"window",
    id:"inv_hist_wind",
    position:"center",
    move:true,
    width:600,
    height:300,
    resize: true,
    head:{
		cols:[
			{
                template:"Causes of inventory decrements",
                type:"header"
            },
			{
				view:"button", label:"Close", width:70, click:("$$('inv_hist_wind').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(inv_hist_dt)
}

var inventory_history = {
    header:"Stock History Detailed",
    body:{
        type:"space",
        rows:[
            {
                cols:[
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"Start Date",
                        // label:"<b>start date:</b>",
                        id:"from_date",
                    },
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"End Date",
                        // label:"<b>end date:</b>",
                        id:"to_date"
                    },
                    {
                        view:"combo",
                        placeholder:"Quick Dates",
                        width:150,
                        id:"quick_date",
                        options:[
                            {id:1,value:"Today"},
                            {id:2,value:"This Week"},
                            {id:3,value:"This Month"}
                        ],
                        on:{
                            onChange:function(){
                                var val = this.getValue();
                                switch (val) {
                                    case 1:
                                        var today = new Date();
                                        $$("from_date").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+1);
                                        $$("to_date").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date(from,to);
                                        break;
                                    case 2:

                                        var today = new Date();
                                        today.setDate(today.getDate()-today.getDay());
                                        $$("from_date").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+7);
                                        $$("to_date").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date(from,to);
                                        break;
                                    case 3:
                                        var today = new Date();
                                        today.setDate(today.getMonth());
                                        $$("from_date").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+30);
                                        $$("to_date").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date(from,to);
                                        break;
                                    default:

                                }
                            }
                        }
                    },
                    {
                        id:"powerview",
                        placeholder:"select a product or leave empty to for all Product",
                        view:"combo",
                        options:[]
                    },
                    {
                        view:"button",
                        type:"iconButton",
                        label:"Generate",
                        icon:"industry",
                        autowidth:true,
                        click:function(){
                            run_date();
                        }
                    }
                ]
            },
            {
                type:"space",
                rows:[
                    {
                        view: "datatable",
                    	id:"ihistory_datatable",
                    	select:"row",
                    	columns:[
                            {id:"id", header:"Description",hidden:true},
                    		{id:"desc", header:"Description",fillspace:6},
                    		{id:"a", header:"Items",fillspace:2,format:webix.i18n.numberFormat},
                            {id:"b", header:"Items",fillspace:2,format:webix.i18n.numberFormat},
                            {id:"c", header:"Items",fillspace:2,format:webix.i18n.numberFormat},
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
            },
            {
                cols:[
                    {
                        view:"button",
                        type:"iconButton",
                        label:"View Increment Details",
                        icon:"arrow-up",
                        autowidth:true,
                        click:function(){
                            $$("inv_inc_wind").show();
                        }
                    },
                    {
                        view:"button",
                        type:"iconButton",
                        label:"View Decrement Details",
                        icon:"arrow-down",
                        autowidth:true,
                        click:function(){
                            $$("inv_dec_wind").show();
                        }
                    },
                    {},
                    {
                        view:"button",
                        type:"iconButton",
                        label:"View Daily History",
                        icon:"",
                        autowidth:true,
                        click:function(){
                            $$("inv_hist_wind").show();
                        }
                    },
                    {},
                    {
                        view:"button",
                        type:"iconButton",
                        label:"Show Graph",
                        icon:"line-chart",
                        autowidth:true,
                        click:function(){
        	                $$("graph_window").show();
        					// $$("chart").parse(prc);
                        }
                    }
                ]
            }
        ]
    }
}
