var credit_sr = {
    header:"Credit Sales Returns",
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
                                            var uri = "/stats/apiv1/stat/periodic/daily/credit/sr";
                                            var report ="daily_credit_sr";
                                            var reporter = webix.copy(daily_credit_sr);
                                            var sortLike = sales_logic.day_sort;
                                            filters = {};
                                            charts = ['_line','_bar'];
                                            sales_logic.showReport(reporter,report,charts,uri,filters,sortLike,sales_logic.filters);
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
                                    image:"/static/images/png/wsr.png",
                                    label: "<b>Weekly</b>",
                                    height:200,
                                    width:300,
                                    click:function () {
                                        var uri = "/stats/apiv1/stat/periodic/weekly/credit/sr";
                                        var report ="weekly_credit_sr";
                                        var reporter = webix.copy(weekly_credit_sr);
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
                                        var uri = "/stats/apiv1/stat/periodic/monthly/credit/sr";
                                        var report ="monthly_credit_sr";
                                        var reporter = webix.copy(monthly_credit_sr);
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
                                        var uri = "/stats/apiv1/stat/periodic/yearly/credit/sr";
                                        var report ="yearly_credit_sr";
                                        var reporter = webix.copy(yearly_credit_sr);
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
                                            var uri = "/stats/apiv1/stat/categoric/product/credit/sr";
                                            var report ="product_credit_sr";
                                            var reporter = webix.copy(product_credit_sr);
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
                                        var uri = "/stats/apiv1/stat/categoric/user/credit/sr";
                                        var report ="user_credit_sr";
                                        var reporter = webix.copy(user_credit_sr);
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
                    //                 image:"/static/images/png/ssr.png",
                    //                 label: "<b>Export</b>",
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
