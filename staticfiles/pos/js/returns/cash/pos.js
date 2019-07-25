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
                        type:"space",
                        rows:[
                            {
                                template:"<b>Cash Sales Returns Register</b>",
                                type:"header"
                            },
                            load_receipt,
                            pos_datatable,
                            pos_buttons,
                        ]
                    }
                ]
            }
        ]
    });

    // logic
    $$("load_receipt").focus();

});
