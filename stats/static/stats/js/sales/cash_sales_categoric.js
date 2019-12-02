var product_cash_sales = {
    view:"scrollview",
    id:"product_cash_sales",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"product_cash_sales_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"product_cash_sales_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"product_cash_sales_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"product_cash_sales_payment_method",
                      options:[],
                  },
                  {
                      id:"product_cash_sales_start",
                      view: "datepicker",
                      stringResult:true,
                      width: 150,
                      placeholder:"from ...",
                  },
                  {
                      view:"label",
                      width:30,
                      label:" - "
                  },
                  {
                      id:"product_cash_sales_end",
                      view: "datepicker",
                      stringResult:true,
                      width: 150,
                      placeholder: "to ..",
                  },
                  {
                      view:"button",
                      value:"Apply Filters",
                      width: 150,
                      click:function(){
                          var uri = "/stats/apiv1/stat/categoric/product/cash/sales";
                          var report ="product_cash_sales";
                          var sortLike = sales_logic.record_sort;
                          filters = sales_logic.collectFilters(report,sales_logic.filters);
                          charts = ['_line','_bar'];
                          sales_logic.filterReport(report,charts,uri,filters,sortLike);
                      }
                  }
                ]
            },
            {
             view: "datatable",
             select:"row",
             id:"product_cash_sales_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Cash Sales For Period : "},
                 {id:"cat", header:"Product",fillspace:1,},
                 {header:"Total Cash Sales For Each Product",id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'product_cash_sales_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"product_cash_sales_line_chart",
                            type:"line",
                            value:"#record#",
                            preset:'plot',
                            height:500,
                            tooltip:{
                                template:"#cat# - #record#"
                            },
                            xAxis:{
                               template:"#cat#",
                               title:"Product",
                            },
                            yAxis:{
                               title:"Cash Sales Per Product"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"product_cash_sales_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"#cat# - #record#"
                            },
                            xAxis:{
                               template:"#cat#",
                               title:"Product",
                            },
                            yAxis:{
                               title:"Cash Sales Per Product"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var user_cash_sales = {
    view:"scrollview",
    id:"user_cash_sales",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"user_cash_sales_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"user_cash_sales_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"user_cash_sales_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"user_cash_sales_payment_method",
                      options:[],
                  },
                  {
                      id:"user_cash_sales_start",
                      view: "datepicker",
                      stringResult:true,
                      width: 150,
                      placeholder:"from ...",
                  },
                  {
                      view:"label",
                      width:30,
                      label:" - "
                  },
                  {
                      id:"user_cash_sales_end",
                      view: "datepicker",
                      stringResult:true,
                      width: 150,
                      placeholder: "to ..",
                  },
                  {
                      view:"button",
                      value:"Apply Filters",
                      width: 150,
                      click:function(){
                          var uri = "/stats/apiv1/stat/categoric/user/cash/sales";
                          var report ="user_cash_sales";
                          var sortLike = sales_logic.record_sort;
                          filters = sales_logic.collectFilters(report,sales_logic.filters);
                          charts = ['_line','_bar'];
                          sales_logic.filterReport(report,charts,uri,filters,sortLike);
                      }
                  }
                ]
            },
            {
             view: "datatable",
             select:"row",
             id:"user_cash_sales_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Cash Sales For Period : "},
                 {id:"cat", header:"User",fillspace:1,},
                 {header:"Total Cash Sales By Each User",id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'user_cash_sales_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"user_cash_sales_line_chart",
                            type:"line",
                            value:"#record#",
                            preset:'plot',
                            height:500,
                            tooltip:{
                                template:"#cat# - #record#"
                            },
                            xAxis:{
                               template:"#cat#",
                               title:"User",
                            },
                            yAxis:{
                               title:"Cash Sales Per User"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"user_cash_sales_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"#cat# - #record#"
                            },
                            xAxis:{
                               template:"#cat#",
                               title:"User",
                            },
                            yAxis:{
                               title:"Cash Sales Per User"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var pay_cash_sales = {
    view:"scrollview",
    id:"pay_cash_sales",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"pay_cash_sales_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"pay_cash_sales_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"pay_cash_sales_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"pay_cash_sales_payment_method",
                      options:[],
                  },
                  {
                      id:"pay_cash_sales_start",
                      view: "datepicker",
                      stringResult:true,
                      width: 150,
                      placeholder:"from ...",
                  },
                  {
                      view:"label",
                      width:30,
                      label:" - "
                  },
                  {
                      id:"pay_cash_sales_end",
                      view: "datepicker",
                      stringResult:true,
                      width: 150,
                      placeholder: "to ..",
                  },
                  {
                      view:"button",
                      value:"Apply Filters",
                      width: 150,
                      click:function(){
                          var uri = "/stats/apiv1/stat/categoric/pay/cash/sales";
                          var report ="pay_cash_sales";
                          var sortLike = sales_logic.record_sort;
                          filters = sales_logic.collectFilters(report,sales_logic.filters);
                          charts = ['_line','_bar'];
                          sales_logic.filterReport(report,charts,uri,filters,sortLike);
                      }
                  }
                ]
            },
            {
             view: "datatable",
             select:"row",
             id:"pay_cash_sales_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Cash Sales For Period : "},
                 {id:"cat", header:"Payment Method",fillspace:1,},
                 {header:"Total Cash Sales To Each Payment Method",id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'pay_cash_sales_tb',
                animate:true,
                cells:[
                    {
                        header:"Pie Chart",
                        body:{
                            view:"chart",
                            id:"pay_cash_sales_line_chart",
                            type:"pie",
                            value:"#record#",
                            pieInnerText:"#cat# - #record#",
                            height:500,
                            tooltip:{
                                template:"#cat# - #record#"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"pay_cash_sales_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"#cat# - #record#"
                            },
                            xAxis:{
                               template:"#cat#",
                               title:"Payment Method",
                            },
                            yAxis:{
                               title:"Cash Sales Per Payment Method"
                            },
                        }
                    },
                ]
            }
        ]
    }
}
