var daily_credit_sr = {
    view:"scrollview",
    id:"daily_credit_sr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"daily_credit_sr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"daily_credit_sr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"daily_credit_sr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"daily_credit_sr_payment_method",
                      options:[],
                  },
                  {
                      id:"daily_credit_sr_start",
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
                      id:"daily_credit_sr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/daily/credit/sr";
                          var report ="daily_credit_sr";
                          var sortLike = sales_logic.day_sort;
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
             id:"daily_credit_sr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Credit Sales Returns For Period : "},
                 {id:"month", header:"Month",fillspace:1,},
                 {id:"day", header:"Day of Year",sort:"int",fillspace:1},
                 {id:"date", header:"Date",sort:"text",fillspace:2},
                 {header:"Total Credit Sales Returns For Each Day",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'daily_credit_sr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"daily_credit_sr_line_chart",
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
                               title:"Credit Sales Returns Per Day"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"daily_credit_sr_bar_chart",
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
                               title:"Credit Sales Returns Per Day"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var weekly_credit_sr = {
    view:"scrollview",
    id:"weekly_credit_sr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"weekly_credit_sr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"weekly_credit_sr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"weekly_credit_sr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"weekly_credit_sr_payment_method",
                      options:[],
                  },
                  {
                      id:"weekly_credit_sr_start",
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
                      id:"weekly_credit_sr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/weekly/credit/sr";
                          var report ="weekly_credit_sr";
                          var sortLike = sales_logic.week_sort;
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
             id:"weekly_credit_sr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Credit Sales Returns For Period : "},
                 {id:"month", header:"Month",fillspace:1,},
                 {id:"week", header:"Week",sort:"text",fillspace:1,template:"Week  #week#"},
                 {header:"Total Credit Sales Returns For Each Week",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'weekly_credit_sr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"weekly_credit_sr_line_chart",
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
                               title:"Credit Sales Returns Per Week"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"weekly_credit_sr_bar_chart",
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
                               title:"Credit Sales Returns Per Week"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var monthly_credit_sr = {
    view:"scrollview",
    id:"monthly_credit_sr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"monthly_credit_sr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"monthly_credit_sr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"monthly_credit_sr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"monthly_credit_sr_payment_method",
                      options:[],
                  },
                  {
                      id:"monthly_credit_sr_start",
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
                      id:"monthly_credit_sr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/monthly/credit/sr";
                          var report ="monthly_credit_sr";
                          var sortLike = sales_logic.month_sort;
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
             id:"monthly_credit_sr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Credit Sales Returns For Period : "},
                 {id:"mname", header:"Month",fillspace:2,},
                 {header:"Total Credit Sales Returns For Each Month",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:3,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'monthly_credit_sr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"monthly_credit_sr_line_chart",
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
                               title:"Credit Sales Returns Per Month"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"monthly_credit_sr_bar_chart",
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
                               title:"Credit Sales Returns Per Month"
                            },
                        }
                    },
                ]
            }
        ]
    }
}

var yearly_credit_sr = {
    view:"scrollview",
    id:"yearly_credit_sr",
    scroll:"y",
    body:{
        type:"space",
        rows:[
            {
              view:"toolbar",
              id:"yearly_credit_sr_bar",
              cols:[
                  {
                      view:"combo",
                      placeholder:'Filter Product ...',
                      id:"yearly_credit_sr_get_product",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter User ...',
                      id:"yearly_credit_sr_get_user",
                      options:[],
                  },
                  {
                      view:"combo",
                      placeholder:'Filter Payment Method ...',
                      id:"yearly_credit_sr_payment_method",
                      options:[],
                  },
                  {
                      id:"yearly_credit_sr_start",
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
                      id:"yearly_credit_sr_end",
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
                          var uri = "/stats/apiv1/stat/periodic/yearly/credit/sr";
                          var report ="yearly_credit_sr";
                          var sortLike = sales_logic.year_sort;
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
             id:"yearly_credit_sr_dt",
             height:400,
             footer:true,
             math:true,
             columns:[
                 {id:"year", header:"Year",sort:"int",fillspace:1,footer:"Total Credit Sales Returns For Period : "},
                 {header:"Total Credit Sales Returns For Each Year",format:webix.i18n.priceFormat,id:"record",sort:"int",fillspace:2,footer:{content:"summColumn"}},
             ],
            },
            {
                view:'tabview',
                id:'yearly_credit_sr_tb',
                animate:true,
                cells:[
                    {
                        header:"Line Chart",
                        body:{
                            view:"chart",
                            id:"yearly_credit_sr_line_chart",
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
                               title:"Credit Sales Returns Per Year"
                            },
                        },
                    },
                    {
                        header:"Vertical Bar Chart",
                        body:{
                            view:"chart",
                            id:"yearly_credit_sr_bar_chart",
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
                               title:"Credit Sales Returns Per Year"
                            },
                        }
                    },
                ]
            }
        ]
    }
}
