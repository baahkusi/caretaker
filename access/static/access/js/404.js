
webix.ready(function(){
    // layout
    var the_window = {
        view:"window",
        id:"window",
        width:250,
        position:"center",
        modal:true,
        head:{
    		cols:[
    			{
    				template:"Resource Not Found 404",
    				type:"header",
    			}
    		]
    	}
    }

    webix.ui(the_window);
    $$("window").show();
});
