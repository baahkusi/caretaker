var product_cash_pr = {
    view:"scrollview",
    id:"product_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"product_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"product_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"product_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"product_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"product_cash_pr_start",
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
                      id:"product_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/categoric/product/cash/pr";
                          var report ="product_cash_pr";
                          var sortLike = pc_logic.record_sort;
                          filters = pc_logic.collectFilters(report,pc_logic.filters);
                          charts = ['_line','_bar'];
                          pc_logic.filterReport(report,charts,uri,filters,sortLike);
                      }
                  }
                ]
            },
            {
             view: "datatable",
             select:"row",
             id:"product_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {id:"cat", header:"Product",fillspace:1,},
                 {header:"Total Cash Purchases Returns For Each Product",id:"record",format:webix.i18n.priceFormat,sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'product_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"product_cash_pr_line_chart",
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
                               title:"Cash Purchases Returns Per Product"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"product_cash_pr_bar_chart",
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
                               title:"Cash Purchases Returns Per Product"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var user_cash_pr = {
    view:"scrollview",
    id:"user_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"user_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"user_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"user_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"user_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"user_cash_pr_start",
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
                      id:"user_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/categoric/user/cash/pr";
                          var report ="user_cash_pr";
                          var sortLike = pc_logic.record_sort;
                          filters = pc_logic.collectFilters(report,pc_logic.filters);
                          charts = ['_line','_bar'];
                          pc_logic.filterReport(report,charts,uri,filters,sortLike);
                      }
                  }
                ]
            },
            {
             view: "datatable",
             select:"row",
             id:"user_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {id:"cat", header:"User",fillspace:1,},
                 {header:"Total Cash Purchases Returns By Each User",id:"record",format:webix.i18n.priceFormat,sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'user_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"user_cash_pr_line_chart",
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
                               title:"Cash Purchases Returns Per User"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"user_cash_pr_bar_chart",
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
                               title:"Cash Purchases Returns Per User"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var pay_cash_pr = {
    view:"scrollview",
    id:"pay_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"pay_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"pay_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"pay_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"pay_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"pay_cash_pr_start",
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
                      id:"pay_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/categoric/pay/cash/pr";
                          var report ="pay_cash_pr";
                          var sortLike = pc_logic.record_sort;
                          filters = pc_logic.collectFilters(report,pc_logic.filters);
                          charts = ['_line','_bar'];
                          pc_logic.filterReport(report,charts,uri,filters,sortLike);
                      }
                  }
                ]
            },
            {
             view: "datatable",
             select:"row",
             id:"pay_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {id:"cat", header:"Payment Method",fillspace:1,},
                 {header:"Total Cash Purchases Returns To Each Payment Method",id:"record",format:webix.i18n.priceFormat,sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'pay_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Pie Chart",
                        body:{
                            view:"chart",
                            id:"pay_cash_pr_line_chart",
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
                            id:"pay_cash_pr_bar_chart",
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
                               title:"Cash Purchases Returns Per Payment Method"
                            },
                        }
                    },
                ]
            }
        ]
    }
}
