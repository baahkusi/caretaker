function doAll_credit(data){
    $$("sales_dt_credit").clearAll();

    $$("sales_dt_credit").parse(data);
}

function run_date_credit(){
    if ($$("from_date_credit").getValue() =="" || $$("to_date_credit").getValue() =="" ) {
        webix.message("Some Date Not Provided","error");
    } else {
        from_date_credit = $$("from_date_credit").getValue().split(" ");
        from_date_credit = from_date_credit[0];
        to_date_credit = new Date($$("to_date_credit").getValue());
        to_date_credit.setDate(to_date_credit.getDate()+1);
        to_date_credit = to_date_credit.toISOString().split("T")[0];

        if (new Date(from_date_credit)>new Date(to_date_credit)) {
            webix.message("start date cannot be greater than end date","error");
        }else if(new Date(from_date_credit)>new Date()){
            webix.message("Start date cannot be greater than today","error");
        }else{

            var dat = {b:from_date_credit,e:to_date_credit};
            var url = "/logger/apiv1/helpers/credit/sr";
            webix.ajax().get(url,dat,function(txt,resp){
                data = resp.json();

                doAll_credit(data);
            });
        }
    }
}

function auto_run_date_credit(from,to){

    var dat = {b:from,e:to};
    var url = "/logger/apiv1/helpers/credit/sr";
    webix.ajax().get(url,dat,function(txt,resp){
        data = resp.json();

        doAll_credit(data);
    });
}

var hide_show_db_credit = {
	view:"dbllist",
	id:"hide_show_db_credit",
	width:300,
    value:"id",
	list:{
		autoheight: true,
		select: false,
		template:function(obj, common){
		  var dir = (common.id  === "left" ? "right" : "left");
		  return obj.value + "<span class='select_one webix_icon fa-arrow-"+dir+"'></span>"
		},
		onClick:{
		  "select_one":function(e, id){
			 var mode = this.config.$id === "left";

			 if (mode) {
			 	$$("sales_dt_credit").hideColumn(id);
			}else{
				$$("sales_dt_credit").showColumn(id);
			}
			 this.getTopParentView().select(id, mode);
			 return false;
		  }
		}
	},
	buttons:false,
	labelLeft:"Visible Columns",
	labelRight:"Hidden Columns",
	labelBottomLeft:"Visible Columns",
	labelBottomRight:"Hidden Columns",
	data:[
		{id:"id",value:"#"},
		{id:"day",value:"Day"},
		{id:"time",value:"Time"},
		{id:"sp",value:"Unit S.P"},
		{id:"cp",value:"Unit C.P"},
		{id:"quantity",value:"Qty"},
		{id:"amount",value:"Sales Amount"},
		{id:"cost",value:"Cost of Sales"},
		// {id:"profit",value:"Profit"},
		{id:"product_name",value:"Product"},
        {id:"employee_id",value:"User"},
        {id:"action",value:"Action"},
	]
}

var hide_show_wind_credit = {
	view:"window",
	id:"hide_show_wind_credit",
	// width:500,
	position:"center",
	move:true,
	resize:true,
	head:{
		cols:[
			{
				template:"Show / Hide Some Columns",
				type:"header",
			},
			{
				view:"button", label:"Close", width:70, click:("$$('hide_show_wind_credit').hide();"),align:"right"
			}
		]
	} ,
	body:webix.copy(hide_show_db_credit)
}

var stock_sales_credit = {
    id: "sales_credit",
    // padding:10,
    cols:[
        {
            id:"sales_dt_credit",
            view:"datatable",
            footer:true,
            math:true,
            select:"row",
            select:true,
            editable:true,
            editaction:"dblclick",
            columns:[
                {id:"id", header:"#",hidden:true},
                {id:"day",header:["Day (mm/dd/yyyy)",{ content:"textFilter" }],fillspace:2,format:webix.i18n.dateFormatStr},
                {id:"time", header:["Time",""]},
                {id:"product_name", header:["Product",{content:"selectFilter"}],sort:"text",fillspace:3},
                {id:"quantity",editor:"text", header:" Qty",footer:{content:"summColumn"},sort:"int"},
                {id:"sp",editor:"text", header:["Unit S.P.  GH&#8373;",{content:"numberFilter"}],fillspace:2},
                {id:"cp",editor:"text", header:["Unit C.P.  GH&#8373;",{content:"numberFilter"}],fillspace:2},
                {id:"amount", header:["Sales Amount  GH&#8373;",{content:"numberFilter"}],math:"[$r,sp]*[$r,quantity]",footer:{content:"summColumn"},sort:"int",fillspace:3},
                {id:"cost", header:["Cost of Sales  GH&#8373;",{content:"numberFilter"}],math:"[$r,cp]*[$r,quantity]",footer:{content:"summColumn"},sort:"int",fillspace:3},
                // {id:"profit", header:["Profit GH&#8373;",{content:"numberFilter"}],math:"[$r,amount]-[$r,cost]",footer:{content:"summColumn"},sort:"int",fillspace:3},
                {id:"employee_id", header:["User",{content:"selectFilter"}],fillspace:2},
                {id:"action", header:"Action",template:"{common.delButt}",fillspace:true}
            ],
            type:{
                delButt:`<button type="button" class="delButt"><span class="webix_icon fa-trash"></span> Remove</button>`
            },
            onClick:{
                delButt:function(e,id,trg){
                    webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this sales",
						type:"confirm-warning",
						callback:function(result){
                            if (result) {
                                // webix.message("deleting sales"+id);
                                // console.log(id.row);
                                var url = "/pos/apiv1/delete/creditsalesreturn";
                                webix.ajax().post(url,{'id':id.row},function(t,r){
                                    var ms = r.json();
                                    if (ms.status) {
                                        webix.message("Sales Deleted");
                                        $$("sales_dt_credit").remove(id);
                                    }else{
                                        webix.message("Could not delete, try again","error");
                                    }
                                });
                            }
                        }
                    });

                }
            }
        }
    ]
}

var credit_sr = {
    header:"Credit Sales Returns",
    body: {
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
                        id:"from_date_credit",
                    },
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"to",
                        label:"<b>end date:</b>",
                        id:"to_date_credit"
                    },{},
                    {
                        view:"combo",
                        placeholder:"Quick Dates",
                        width:150,
                        id:"quick_date_credit",
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
                                        $$("from_date_credit").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+1);
                                        $$("to_date_credit").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_credit(from,to);
                                        break;
                                    case 2:

                                        var today = new Date();
                                        today.setDate(today.getDate()-today.getDay());
                                        $$("from_date_credit").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+7);
                                        $$("to_date_credit").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_credit(from,to);
                                        break;
                                    case 3:
                                        var today = new Date();
                                        today.setDate(today.getMonth());
                                        $$("from_date_credit").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+30);
                                        $$("to_date_credit").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_credit(from,to);
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
                            run_date_credit();
                        }
                    },{},
                    {
                        view:"button",
                        type:"iconButton",
                        label:"show / hide columns",
                        icon:"eye",
                        autowidth:true,
                        click:function(){
                            $$("hide_show_wind_credit").show();
                        }
                    }
                ]
            },
            stock_sales_credit,
        ]
    }
}
