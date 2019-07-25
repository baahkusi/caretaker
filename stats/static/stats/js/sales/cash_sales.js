
var cash_sales = {
    header:"Cash Sales",
    body:{
        // type:"space",
        rows:[
            {
                type:"clean",
                padding:10,
                cols:[
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                        view:"button",
                                        type: "image", image:"/static/images/png/dsales.png",
                                        label: "<b>Daily</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/periodic/daily/cash/sales";
                                            var report ="daily_cash_sales";
                                            var reporter = webix.copy(daily_cash_sales);
                                            var sortLike = sales_logic.day_sort;
                                            filters = {};
                                            charts = ['_line','_bar'];
                                            sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                        }
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                    view:"button",
                                    type: "image",
                                    image:"/static/images/png/wsales.png",
                                    label: "<b>Weekly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/weekly/cash/sales";
                                        var report ="weekly_cash_sales";
                                        var reporter = webix.copy(weekly_cash_sales);
                                        var sortLike = sales_logic.week_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                    }
                                },
                            ]
                        }
                        ]
                    },
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                    view:"button",
                                    type: "image",
                                    image:"/static/images/png/msales.png",
                                    label: "<b>Monthly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/monthly/cash/sales";
                                        var report ="monthly_cash_sales";
                                        var reporter = webix.copy(monthly_cash_sales);
                                        var sortLike = sales_logic.month_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                    }
                                },
                            ]
                        }
                        ]
                    },
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                    view:"button",
                                    type: "image",
                                    image:"/static/images/png/ysales.png",
                                    label: "<b>Yearly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/yearly/cash/sales";
                                        var report ="yearly_cash_sales";
                                        var reporter = webix.copy(yearly_cash_sales);
                                        var sortLike = sales_logic.year_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                    }
                                },
                            ]
                        }
                        ]
                    },{}
                ]
            },
            {
                padding:10,
                type:"clean",
                cols:[
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                        view:"button",
                                        type: "image", image:"/static/images/png/psales.png",
                                        label: "<b>By Product</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/categoric/product/cash/sales";
                                            var report ="product_cash_sales";
                                            var reporter = webix.copy(product_cash_sales);
                                            var sortLike = sales_logic.record_sort;
                                            filters = {};
                                            charts = ['_line','_bar'];
                                            sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                        }
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                    view:"button",
                                    type: "image",
                                    image:"/static/images/png/usales.png",
                                    label: "<b>By User</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/user/cash/sales";
                                        var report ="user_cash_sales";
                                        var reporter = webix.copy(user_cash_sales);
                                        var sortLike = sales_logic.record_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                    }
                                },
                            ]
                        }
                        ]
                    },
                    {
                        height:200,
                        type:"clean",
                        rows:[
                            {
                                cols:[
                                    {
                                    view:"button",
                                    type: "image",
                                    image:"/static/images/png/pmsales.png",
                                    label: "<b>By Payment Method</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/pay/cash/sales";
                                        var report ="pay_cash_sales";
                                        var reporter = webix.copy(pay_cash_sales);
                                        var sortLike = sales_logic.record_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                    }
                                },
                            ]
                        }
                        ]
                    },
                    // {
                    //     height:200,
                    //     type:"clean",
                    //     rows:[
                    //         {
                    //             cols:[
                    //                 {
                    //                 view:"button",
                    //                 type: "image",
                    //                 image:"/static/images/png/ssales.png",
                    //                 label: "<b>Exporter</b>",
                    //                 height:200,
                    //                 width:300
                    //             },
                    //         ]
                    //     }
                    //     ]
                    // },
                    {}
                ]
            },{}
        ]
    }
}
