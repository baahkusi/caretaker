var cash_pr = {
    header:"Cash Purchases Returns",
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
                                        type: "image", image:"/static/images/png/dpr.png",
                                        label: "<b>Daily</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/periodic/daily/cash/pr";
                                            var report ="daily_cash_pr";
                                            var reporter = webix.copy(daily_cash_pr);
                                            var sortLike = pc_logic.day_sort;
                                            filters = {};
                                            charts = ['_line','_bar'];
                                            pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
                                    },
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
                                    image:"/static/images/png/wpr.png",
                                    label: "<b>Weekly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/weekly/cash/pr";
                                        var report ="weekly_cash_pr";
                                        var reporter = webix.copy(weekly_cash_pr);
                                        var sortLike = pc_logic.week_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
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
                                    image:"/static/images/png/mpr.png",
                                    label: "<b>Monthly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/monthly/cash/pr";
                                        var report ="monthly_cash_pr";
                                        var reporter = webix.copy(monthly_cash_pr);
                                        var sortLike = pc_logic.month_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
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
                                    image:"/static/images/png/ypr.png",
                                    label: "<b>Yearly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/yearly/cash/pr";
                                        var report ="yearly_cash_pr";
                                        var reporter = webix.copy(yearly_cash_pr);
                                        var sortLike = pc_logic.year_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
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
                                        type: "image", image:"/static/images/png/ppr.png",
                                        label: "<b>By Product</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/categoric/product/cash/pr";
                                            var report ="product_cash_pr";
                                            var reporter = webix.copy(product_cash_pr);
                                            var sortLike = pc_logic.record_sort;
                                            filters = {};
                                            charts = ['_line','_bar'];
                                            pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
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
                                    image:"/static/images/png/upr.png",
                                    label: "<b>By User</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/user/cash/pr";
                                        var report ="product_cash_pr";
                                        var reporter = webix.copy(product_cash_pr);
                                        var sortLike = pc_logic.record_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
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
                                    image:"/static/images/png/pmpr.png",
                                    label: "<b>By Payment Method</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/pay/cash/pr";
                                        var report ="pay_cash_pr";
                                        var reporter = webix.copy(pay_cash_pr);
                                        var sortLike = pc_logic.record_sort;
                                        filters = {};
                                        charts = ['_line','_bar'];
                                        pc_logic.showReport(reporter,report,charts,uri,filters,sortLike,pc_logic.filters);
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
                    //                 image:"/static/images/png/spr.png",
                    //                 label: "<b>Summary</b>",
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
