var daily_cash_pr = {
    view:"scrollview",
    id:"daily_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"daily_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"daily_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"daily_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"daily_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"daily_cash_pr_start",
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
                      id:"daily_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/daily/cash/pr";
                          var report ="daily_cash_pr";
                          var sortLike = pc_logic.day_sort;
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
             id:"daily_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {id:"month", header:"Month",fillspace:1,},
                 {id:"day", header:"Day of Year",sort:"int",fillspace:1},
                 {id:"date", header:"Date",sort:"text",fillspace:2},
                 {header:"Total Cash Purchases Returns For Each Day",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'daily_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"daily_cash_pr_line_chart",
                            type:"line",
                            value:"#record#",
                            preset:'plot',
                            height:500,
                            tooltip:{
                                template:"#date# - #record#"
                            },
                            xAxis:{
                               template:"#day#",
                               title:"Day",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Day"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"daily_cash_pr_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"#date# - #record#"
                            },
                            xAxis:{
                               template:"#day#",
                               title:"Day",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Day"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var weekly_cash_pr = {
    view:"scrollview",
    id:"weekly_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"weekly_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"weekly_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"weekly_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"weekly_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"weekly_cash_pr_start",
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
                      id:"weekly_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/weekly/cash/pr";
                          var report ="weekly_cash_pr";
                          var sortLike = pc_logic.week_sort;
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
             id:"weekly_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {id:"month", header:"Month",fillspace:1,},
                 {id:"week", header:"Week",sort:"text",fillspace:1,template:"Week  #week#"},
                 {header:"Total Cash Purchases Returns For Each Week",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'weekly_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"weekly_cash_pr_line_chart",
                            type:"line",
                            value:"#record#",
                            preset:'plot',
                            height:500,
                            tooltip:{
                                template:"Week #week# - #record#"
                            },
                            xAxis:{
                               template:"#week#",
                               title:"Week",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Week"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"weekly_cash_pr_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"Week #week# - #record#"
                            },
                            xAxis:{
                               template:"#week#",
                               title:"Week",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Week"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var monthly_cash_pr = {
    view:"scrollview",
    id:"monthly_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"monthly_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"monthly_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"monthly_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"monthly_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"monthly_cash_pr_start",
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
                      id:"monthly_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/monthly/cash/pr";
                          var report ="monthly_cash_pr";
                          var sortLike = pc_logic.month_sort;
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
             id:"monthly_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {id:"mname", header:"Month",fillspace:2,},
                 {header:"Total Cash Purchases Returns For Each Month",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:3,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'monthly_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"monthly_cash_pr_line_chart",
                            type:"line",
                            value:"#record#",
                            preset:'plot',
                            height:500,
                            tooltip:{
                                template:"#mname# - #record#"
                            },
                            xAxis:{
                               template:"#mname#",
                               title:"Month",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Month"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"monthly_cash_pr_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"#mname# - #record#"
                            },
                            xAxis:{
                               template:"#mname#",
                               title:"Month",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Month"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var yearly_cash_pr = {
    view:"scrollview",
    id:"yearly_cash_pr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"yearly_cash_pr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"yearly_cash_pr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"yearly_cash_pr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"yearly_cash_pr_payment_method",
                      options:[],
                  },
                  {
                      id:"yearly_cash_pr_start",
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
                      id:"yearly_cash_pr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/yearly/cash/pr";
                          var report ="yearly_cash_pr";
                          var sortLike = pc_logic.year_sort;
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
             id:"yearly_cash_pr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Cash Purchases Returns For Period : "},
                 {header:"Total Cash Purchases Returns For Each Year",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'yearly_cash_pr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"yearly_cash_pr_line_chart",
                            type:"line",
                            value:"#record#",
                            preset:'plot',
                            height:500,
                            tooltip:{
                                template:"#year# - #record#"
                            },
                            xAxis:{
                               template:"#year#",
                               title:"Year",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Year"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"yearly_cash_pr_bar_chart",
                            type:"bar",
                            value:"#record#",
                            preset:'column',
                            height:500,
                            tooltip:{
                                template:"#year# - #record#"
                            },
                            xAxis:{
                               template:"#year#",
                               title:"Year",
                            },
                            yAxis:{
                               title:"Cash Purchases Returns Per Year"
                            },
                        }
                    },
                ]
            }
        ]
    }
}
