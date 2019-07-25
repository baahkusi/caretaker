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
                                template:"<b>Cash Purchases Returns Register </b>",
                                type:"header"
                            },
                            load_receipt,
                            pop_datatable,
                            pop_buttons,
                        ]
                    }
                ]
            }
        ]
    });

    // logic
    $$("load_receipt").focus();

});
