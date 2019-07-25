var cash_purchases = {
    header:"Cash Purchases",
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
                                        type: "image", image:"/static/images/png/dpc.png",
                                        label: "<b>Daily</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/periodic/daily/cash/pc";
                                            var report ="daily_cash_pc";
                                            var reporter = webix.copy(daily_cash_pc);
                                            var sortLike = pc_logic.day_sort;
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
                                    image:"/static/images/png/wpc.png",
                                    label: "<b>Weekly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/weekly/cash/pc";
                                        var report ="weekly_cash_pc";
                                        var reporter = webix.copy(weekly_cash_pc);
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
                                    image:"/static/images/png/mpc.png",
                                    label: "<b>Monthly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/monthly/cash/pc";
                                        var report ="monthly_cash_pc";
                                        var reporter = webix.copy(monthly_cash_pc);
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
                                    image:"/static/images/png/ypc.png",
                                    label: "<b>Yearly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/yearly/cash/pc";
                                        var report ="yearly_cash_pc";
                                        var reporter = webix.copy(yearly_cash_pc);
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
                                        type: "image", image:"/static/images/png/ppc.png",
                                        label: "<b>By Product</b>",
                                        height:200,
                                        width:300,
                                        click:function () {
                                            var uri = "/stats/apiv1/stat/categoric/product/cash/pc";
                                            var report ="product_cash_pc";
                                            var reporter = webix.copy(product_cash_pc);
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
                                    image:"/static/images/png/upc.png",
                                    label: "<b>By User</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/user/cash/pc";
                                        var report ="user_cash_pc";
                                        var reporter = webix.copy(user_cash_pc);
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
                                    image:"/static/images/png/pmpc.png",
                                    label: "<b>By Payment Method</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/categoric/pay/cash/pc";
                                        var report ="pay_cash_pc";
                                        var reporter = webix.copy(pay_cash_pc);
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
                    //                 image:"/static/images/png/spc.png",
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
