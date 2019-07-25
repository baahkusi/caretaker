webix.ready(function(){
    // layout
    webix.ui({

        rows:[
           toolbar,
           {
                cols:[
                    side,
                    {
                        type:"space",
                        rows:[
                            {
                                template:"<b>Sales Log</b>",
                                type:"header",
                            },
                            {
                                id:"logs",
                                view: "tabview",
                                cells: [
                                    cash_sales,
                                    credit_sales
                                ]
                            }
                        ]

                    }
                ]
            }
        ]
    });

    // windows

    webix.ui(hide_show_wind_credit);
    webix.ui(hide_show_wind_cash);


    webix.i18n.setLocale("gh-GH");
});
