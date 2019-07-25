var cash_sr = {
    header:"Cash Sales Returns",
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
                                        type: "image", image:"/static/images/png/dsr.png",
                                        label: "<b>Daily</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/periodic/daily/cash/sr";
                                            var report ="daily_cash_sr";
                                            var reporter = webix.copy(daily_cash_sr);
                                            var sortLike = sales_logic.day_sort;
                                            filters = {};
                                            charts = ['_line','_bar'];
                                            sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
                                    },
                                }
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
                                    image:"/static/images/png/wsr.png",
                                    label: "<b>Weekly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/weekly/cash/sr";
                                        var report ="weekly_cash_sr";
                                        var reporter = webix.copy(weekly_cash_sr);
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
                                    image:"/static/images/png/msr.png",
                                    label: "<b>Monthly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/monthly/cash/sr";
                                        var report ="monthly_cash_sr";
                                        var reporter = webix.copy(monthly_cash_sr);
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
                                    image:"/static/images/png/ysr.png",
                                    label: "<b>Yearly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/yearly/cash/sr";
                                        var report ="yearly_cash_sr";
                                        var reporter = webix.copy(yearly_cash_sr);
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
                                        type: "image", image:"/static/images/png/psr.png",
                                        label: "<b>By Product</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/categoric/product/cash/sr";
                                            var report ="product_cash_sr";
                                            var reporter = webix.copy(product_cash_sr);
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
                                    image:"/static/images/png/usr.png",
                                    label: "<b>By User</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/product/cash/sr";
                                        var report ="product_cash_sr";
                                        var reporter = webix.copy(product_cash_sr);
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
                                    image:"/static/images/png/pmsr.png",
                                    label: "<b>By Payment Method</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/pay/cash/sr";
                                        var report ="pay_cash_sr";
                                        var reporter = webix.copy(pay_cash_sr);
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
                    {}
                ]
            },{}
        ]
    }
}
