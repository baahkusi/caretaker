var credit_sales = {
    header:"Credit Sales",
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
                                            var uri = "/stats/apiv1/stat/periodic/daily/credit/sales";
                                            var report ="daily_credit_sales";
                                            var reporter = webix.copy(daily_credit_sales);
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
                                        var uri = "/stats/apiv1/stat/periodic/weekly/credit/sales";
                                        var report ="weekly_credit_sales";
                                        var reporter = webix.copy(weekly_credit_sales);
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
                                        var uri = "/stats/apiv1/stat/periodic/monthly/credit/sales";
                                        var report ="monthly_credit_sales";
                                        var reporter = webix.copy(monthly_credit_sales);
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
                                        var uri = "/stats/apiv1/stat/periodic/yearly/credit/sales";
                                        var report ="yearly_credit_sales";
                                        var reporter = webix.copy(yearly_credit_sales);
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
                                            var uri = "/stats/apiv1/stat/categoric/product/credit/sales";
                                            var report ="product_credit_sales";
                                            var reporter = webix.copy(product_credit_sales);
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
                                        var uri = "/stats/apiv1/stat/categoric/user/credit/sales";
                                        var report ="user_credit_sales";
                                        var reporter = webix.copy(user_credit_sales);
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
