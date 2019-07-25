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
                                template:"<b>Sales Reports</b>",
                                type:"header"
                            },
                            {
                                rows:[
                                    {
                                        id:"stats",
                                        view:"tabview",
                                        animate:true,
                                        cells:[
                                            cash_sales,
                                            cash_sr,
                                            credit_sales,
                                            credit_sr,
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

    // Windows
    webix.ui({
        view:"window",
        id:"report_window",
        width:900,
        height:600,
        position:"center",
    	move:true,
        resize:true,
        head:{
    		cols:[
    			{
    				template:"Sales Reports",
    				// type:"header",
    			},
    			{
    				view:"button", label:"Close", width:70, click:("$$('report_window').hide();"),
                    align:"right",
    			}
    		]
    	} ,
        body:{
            id:"report_window_body",
            rows:[]
        }
    });

    webix.i18n.setLocale("gh-GH");
});
