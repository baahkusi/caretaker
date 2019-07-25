webix.ready(function(){
    // layout
    webix.ui({
        // type:"wide",
        rows:[
           toolbar,
            {
                cols:[
                    side,
                    {
                        paddingX:10,
                        type:"space",
                        rows:[
                            {
                                template:"Cash and Payment Systems Management",
                                type:"header"
                            },
                            {
                                rows:[
                                    {
                                        id:"cash",
                                        view:"tabview",
                                        cells:[
                                            systems,
                                            systems_history,
                                            systems_history_brief
                                        ]
                                    }
                                ]

                            }
                        ]
                    }
                ]
            }
        ]
    });

    webix.ui(graph_window);
    webix.ui(systems_window);
    webix.ui(systems_window_inc);
    webix.ui(systems_window_dec);
    webix.ui(inv_inc_wind);
    webix.ui(inv_dec_wind);
    webix.ui(inv_hist_wind);
    webix.i18n.setLocale("gh-GH");

});
