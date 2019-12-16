function doAllDt(data){
    $$("idthistory_datatable").clearAll();

    $$("idthistory_datatable").parse(data.summary);

}

function run_date_dt(){
    if ($$("from_date_dt").getValue() =="" || $$("to_date_dt").getValue() =="" ) {
        webix.message("Some Date Not Provided","error");
    } else {
        from_date_dt = $$("from_date_dt").getValue().split(" ");
        from_date_dt = from_date_dt[0];
        to_date_dt = new Date($$("to_date_dt").getValue());
        to_date_dt.setDate(to_date_dt.getDate()+1);
        to_date_dt = to_date_dt.toISOString().split("T")[0];
        if (new Date(from_date_dt)>new Date(to_date_dt)) {
            webix.message("start date cannot be greater than end date","error");
        }else if(new Date(from_date_dt)>new Date()){
            webix.message("Start date cannot be greater than today","error");
        }else{
            // webix.message(from_date_dt+" "+to_date_dt);
            var dat = {b:from_date_dt,e:to_date_dt};
            var url = "/cash/apiv1/helpers/track/summary";
            $$("idthistory_datatable").clearAll();
            $$('idthistory_datatable').showOverlay("<b>Loading data ...</b>");
            webix.ajax().get(url,dat,function(txt,resp){
                data = resp.json();
                $$('idthistory_datatable').hideOverlay();
                if (data.status) {
                    doAllDt(data);
                }
            });
        }
    }
}

function auto_run_date_dt(from,to){

    var dat = {b:from,e:to};
    var url = "/cash/apiv1/helpers/track/summary";
    $$("idthistory_datatable").clearAll();
    $$('idthistory_datatable').showOverlay("<b>Loading data ...</b>");
    webix.ajax().get(url,dat,function(txt,resp){
        data = resp.json();
        $$('idthistory_datatable').hideOverlay();
        if (data.status) {
            doAllDt(data);
        }
    });
}

var systems_history = {
    header:"Cash Detailed Movements",
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
                        id:"from_date_dt",
                    },
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"to",
                        label:"<b>end date:</b>",
                        id:"to_date_dt"
                    },{},
                    {
                        view:"combo",
                        placeholder:"Quick Dates",
                        width:150,
                        id:"quick_date_dt",
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
                                        $$("from_date_dt").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+1);
                                        $$("to_date_dt").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_dt(from,to);
                                        break;
                                    case 2:
                                        var today = new Date();
                                        today.setDate(today.getDate()-today.getDay());
                                        $$("from_date_dt").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+7);
                                        $$("to_date_dt").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_dt(from,to);
                                        break;
                                    case 3:
                                        var today = new Date();
                                        today.setDate(today.getMonth());
                                        $$("from_date_dt").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+30);
                                        $$("to_date_dt").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_dt(from,to);
                                        break;
                                    default:

                                }
                            }
                        }
                    },{},
                    {
                        view:"button",
                        type:"iconButton",
                        label:"Generate",
                        icon:"industry",
                        autowidth:true,
                        click:function(){
                            run_date_dt();
                        }
                    }
                ]
            },
            {
                type:"space",
                rows:[
                    {
                        view: "datatable",
                    	id:"idthistory_datatable",
                    	select:"row",
                        footer:true,
                    	columns:[
                    		{id:"system", header:["Payment System",{content:"selectFilter"}],fillspace:2},
                    		{id:"init", header:["Initial Bal",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"inc", header:["Increments",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"sales", header:["Sales",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"pr", header:["Purchases Returns",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"dec", header:["Decrements",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"purchases", header:["Purchases",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"sr", header:["Sales Returns",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
                            {id:"end", header:["Ending Bal",{content:"numberFilter"}],format:webix.i18n.priceFormat,fillspace:2,sort:"int",footer:{content:"summColumn"}},
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
        ]
    }
}
