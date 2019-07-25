var credit_purchases = {
    header:"Credit Purchases",
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
                                            var uri = "/stats/apiv1/stat/periodic/daily/credit/pc";
                                            var report ="daily_credit_pc";
                                            var reporter = webix.copy(daily_credit_pc);
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
                                        var uri = "/stats/apiv1/stat/periodic/weekly/credit/pc";
                                        var report ="weekly_credit_pc";
                                        var reporter = webix.copy(weekly_credit_pc);
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
                                        var uri = "/stats/apiv1/stat/periodic/monthly/credit/pc";
                                        var report ="monthly_credit_pc";
                                        var reporter = webix.copy(monthly_credit_pc);
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
                                        var uri = "/stats/apiv1/stat/periodic/yearly/credit/pc";
                                        var report ="yearly_credit_pc";
                                        var reporter = webix.copy(yearly_credit_pc);
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
                                            var uri = "/stats/apiv1/stat/categoric/product/credit/pc";
                                            var report ="product_credit_pc";
                                            var reporter = webix.copy(product_credit_pc);
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
                                        var uri = "/stats/apiv1/stat/categoric/user/credit/pc";
                                        var report ="user_credit_pc";
                                        var reporter = webix.copy(user_credit_pc);
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
