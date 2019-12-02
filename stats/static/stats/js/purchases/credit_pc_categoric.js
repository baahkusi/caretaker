var product_credit_pc = {
    view:"scrollview",
    id:"product_credit_pc",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"product_credit_pc_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"product_credit_pc_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"product_credit_pc_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"product_credit_pc_payment_method",
                      options:[],
                  },
                  {
                      id:"product_credit_pc_start",
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
                      id:"product_credit_pc_end",
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
                          var uri = "/stats/apiv1/stat/categoric/product/credit/pc";
                          var report ="product_credit_pc";
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
             id:"product_credit_pc_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Credit Purchases For Period : "},
                 {id:"cat", header:"Product",fillspace:1,},
                 {header:"Total Credit Purchases For Each Product",id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'product_credit_pc_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"product_credit_pc_line_chart",
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
                               title:"Credit Purchases Per Product"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"product_credit_pc_bar_chart",
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
                               title:"Credit Purchases Per Product"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var user_credit_pc = {
    view:"scrollview",
    id:"user_credit_pc",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"user_credit_pc_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"user_credit_pc_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"user_credit_pc_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"user_credit_pc_payment_method",
                      options:[],
                  },
                  {
                      id:"user_credit_pc_start",
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
                      id:"user_credit_pc_end",
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
                          var uri = "/stats/apiv1/stat/categoric/user/credit/pc";
                          var report ="user_credit_pc";
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
             id:"user_credit_pc_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"cat_id", header:"#",sort:"int",fillspace:1,footer:"Total Credit Purchases For Period : "},
                 {id:"cat", header:"User",fillspace:1,},
                 {header:"Total Credit Purchases By Each User",id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'user_credit_pc_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"user_credit_pc_line_chart",
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
                               title:"Credit Purchases Per User"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"user_credit_pc_bar_chart",
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
                               title:"Credit Purchases Per User"
                            },
                        }
                    },
                ]
            }
        ]
    }
}
