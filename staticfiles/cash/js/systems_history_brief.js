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
            webix.message(from_date+" "+to_date+" "+powerview);
            var dat = {b:from_date,e:to_date,p:powerview};
            var url = "/cash/apiv1/helpers/track";
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
    var url = "/cash/apiv1/helpers/track";
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
                {id:"amount", header:" Amount",footer:{content:"summColumn"},sort:"int",format:webix.i18n.priceFormat},
                {id:"cash_id", header:["Payment System",{content:"selectFilter"}],sort:"text",fillspace:3},
                {id:"comment", header:["Reason",{content:"selectFilter"}],fillspace:2},
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
                {id:"amount", header:" Amount",footer:{content:"summColumn"},sort:"int",format:webix.i18n.priceFormat},
                {id:"cash_id", header:["Payment System",{content:"selectFilter"}],sort:"text",fillspace:3},
                {id:"comment", header:["Reason",{content:"selectFilter"}],fillspace:2},
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
                {id:"bal", header:" Cash On Hand",sort:"int",fillspace:true},
            ]
        }
    ]
}

var chart = {
   view:"chart",
   id:"chart",
   type:"line",
   value:"#cash#",
   preset:'diamond',
    item:{
            borderColor: "#ffffff",
            color: "#2b7100",
        },
    tooltip:{
            template:"#cash#"
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
       title:"Cash on hand"
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
                template:"Cash on hand per day for the selected period",
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
                template:"Causes of cash increments",
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
                template:"Causes of cash decrements",
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
                template:"Causes of cash decrements",
                type:"header"
            },
			{
				view:"button", label:"Close", width:70, click:("$$('inv_hist_wind').hide();"),align:"right"
			}
		]
	} ,
    body:webix.copy(inv_hist_dt)
}

var systems_history_brief = {
    header:"Cash Summary Movements",
    body:{
        type:"space",
        rows:[
            {
                cols:[
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"from",
                        label:"<b>start date:</b>",
                        id:"from_date",
                    },
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"to",
                        label:"<b>end date:</b>",
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
                        width:400,
                        id:"powerview",
                        placeholder:"select a payment System or leave empty to for all Payment System",
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
                    		{id:"a", header:"Amount",fillspace:2,format:webix.i18n.numberFormat},
                            {id:"b", header:"Amount",fillspace:2,format:webix.i18n.numberFormat},
                            {id:"c", header:"Amount",fillspace:2,format:webix.i18n.numberFormat},
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
