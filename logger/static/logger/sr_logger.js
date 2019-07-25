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
                                template:"<b>Sales Returns Log</b>",
                                type:"header",
                            },
                            {
                                id:"logs",
                                view: "tabview",
                                cells: [
                                    cash_sr,
                                    credit_sr
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
