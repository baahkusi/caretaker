function doAll_cash(data){
    $$("purchases_datatable_cash").clearAll();

    $$("purchases_datatable_cash").parse(data);
}

function run_date_cash(){
    if ($$("from_date_cash").getValue() =="" || $$("to_date_cash").getValue() =="" ) {
        webix.message("Some Date Not Provided","error");
    } else {
        from_date = $$("from_date_cash").getValue().split(" ");
        from_date = from_date[0];
        to_date = new Date($$("to_date_cash").getValue());
        to_date.setDate(to_date.getDate()+1);
        to_date = to_date.toISOString().split("T")[0];

        if (new Date(from_date)>new Date(to_date)) {
            webix.message("start date cannot be greater than end date","error");
        }else if(new Date(from_date)>new Date()){
            webix.message("Start date cannot be greater than today","error");
        }else{

            var dat = {b:from_date,e:to_date};
            var url = "/logger/apiv1/helpers/cash/pc";
            webix.ajax().get(url,dat,function(txt,resp){
                data = resp.json();

                doAll_cash(data);
            });
        }
    }
}

function auto_run_date_cash(from,to){

    var dat = {b:from,e:to};
    var url = "/logger/apiv1/helpers/cash/pc";
    webix.ajax().get(url,dat,function(txt,resp){
        data = resp.json();

        doAll_cash(data);
    });
}

var hide_show_db_cash = {
	view:"dbllist",
	id:"hide_show_db_cash",
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
			 	$$("purchases_datatable_cash").hideColumn(id);
			}else{
				$$("purchases_datatable_cash").showColumn(id);
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
		{id:"cp",value:"Unit C.P"},
		{id:"quantity",value:"Qty"},
		{id:"amount",value:"Sales Amount"},
		{id:"supplier",value:"Supplier"},
		{id:"product_name",value:"Product"},
        {id:"employee_id",value:"User"},
        {id:"action",value:"Action"},
	]
}

var hide_show_wind_cash = {
	view:"window",
	id:"hide_show_wind_cash",
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
				view:"button", label:"Close", width:70, click:("$$('hide_show_wind_cash').hide();"),align:"right"
			}
		]
	} ,
	body:webix.copy(hide_show_db_cash)
}

var stock_purchases_cash = {
    id:"purchases_cash",
    // padding:10,
    cols:[
        {
            id:"purchases_datatable_cash",
            view:"datatable",
            footer:true,
            math:true,
            select:"row",
            select:true,
            editable:true,
            editaction:"dblclick",
            columns:[
                {id:"id", header:"",hidden:false},
                {id:"day",header:["Day (mm/dd/yyyy)",{ content:"textFilter" }],format:webix.i18n.dateFormatStr,fillspace:2},
                {id:"time", header:["Time",""]},
                {id:"product_name", header:["Product",{content:"selectFilter"}],sort:"text",fillspace:2},
                {id:"cp", header:["Unit C.P.","GH&#8373;"],format:webix.i18n.priceFormat,fillspace:2},
                {id:"quantity", header:" Qty",footer:{content:"summColumn"},sort:"int"},
                {id:"amount", header:["Amount","GH&#8373;"],math:"[$r,cp]*[$r,quantity]",footer:{content:"summColumn"},sort:"int",format:webix.i18n.priceFormat,fillspace:3},
                {id:"supplier_name", header:["Supplier",{content:"selectFilter"}],sort:"text",fillspace:2},
                {id:"employee_id", header:["User",{content:"selectFilter"}],fillspace:2},
                {id:"action", header:"Action",template:"{common.delButtP}",fillspace:true},
            ],
            type:{
                delButtP:`<button type="button" class="delButtP"><span class="webix_icon fa-trash"></span> Remove</button>`
            },
            onClick:{
                delButtP:function(e,id,trg){
                    webix.confirm({
						title: "Delete",
						ok:"Yes", cancel:"No",
						text:"Are you sure you want to delete this purchases",
						type:"confirm-warning",
						callback:function(result){
                            if (result) {
                                // webix.message("deleting sales"+id);
                                // console.log(id.row);
                                var url = "/pop/apiv1/delete/cashpurchase";
                                webix.ajax().post(url,{'id':id.row},function(t,r){
                                    var ms = r.json();
                                    if (ms.status) {
                                        webix.message("Purchases Deleted");
                                        $$("purchases_datatable_cash").remove(id);
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

var cash_pc = {
    header: "Cash Purchases",
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
                        id:"from_date_cash",
                    },
                    {
                        width:300,
                        view:"datepicker",
                        stringResult:true,
                        placeholder:"to",
                        label:"<b>end date:</b>",
                        id:"to_date_cash"
                    },{},
                    {
                        view:"combo",
                        placeholder:"Quick Dates",
                        width:150,
                        id:"quick_date_cash",
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
                                        $$("from_date_cash").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+1);
                                        $$("to_date_cash").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_cash(from,to);
                                        break;
                                    case 2:

                                        var today = new Date();
                                        today.setDate(today.getDate()-today.getDay());
                                        $$("from_date_cash").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+7);
                                        $$("to_date_cash").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_cash(from,to);
                                        break;
                                    case 3:
                                        var today = new Date();
                                        today.setDate(today.getMonth());
                                        $$("from_date_cash").setValue(today);
                                        var from = today.toISOString().split("T")[0];
                                        today.setDate(today.getDate()+30);
                                        $$("to_date_cash").setValue(today);
                                        var to = today.toISOString().split("T")[0];
                                        auto_run_date_cash(from,to);
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
                            run_date_cash();
                        }
                    },{},
                    {
                        view:"button",
                        type:"iconButton",
                        label:"show / hide columns",
                        icon:"eye",
                        autowidth:true,
                        click:function(){
                            $$("hide_show_wind_cash").show();
                        }
                    }
                ]
            },
            stock_purchases_cash,
        ]
    }
}
