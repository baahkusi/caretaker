
webix.ready(function(){
    
    // layout
    function login(){
        var fdata = $$("log_form").getValues();
        
        url = "/access/login";
        webix.ajax().post(url,fdata,function(txt, resp){

            msg = resp.json();
            if (msg.status) {
                window.location = "/access/home";
            }else{
                webix.alert("Access Denied !!!");
            }
        });
    }

    var form = {
        view:"form",
        id:"log_form",
        width:300,
        elementsConfig:{
    		labelPosition:"top",
    	},
        elements:[
            {
                view:"text",
                label:"Username",
                name:"username",
                required:true,
                on:{
                    onEnter:function(){
                        if (this.getValue()!="") {
                            $$("log_form").elements.password.focus();
                        }
                    }
                }
            },
            {
                view:"text",
                type:"password",
                label:"Password",
                name:"password",
                required:true,
                on:{
                    onEnter:function(){
                        var use = $$("log_form").elements.username.getValue();
                        if (use=="") {
                            $$("log_form").elements.username.focus();
                        }else if (this.getValue()=="") {

                        }else {
                            login();
                        }
                    }
                }
            },
            { margin:5,
                cols:[
                    {
                        view:"button",
                        value:"Login" ,
                        type:"form",
                        click:function(){
                            login();
                        }
                    }
                ]
            }
        ]
    };

    var the_window = {
        view:"window",
        id:"window",
        width:300,
        position:"center",
        modal:true,
        head:{
    		cols:[
    			{
    				template:"Welcome",
    				type:"header",
    			},
                {
    				template:"Login",
    				type:"header",
    			}
    		]
    	} ,
        body:webix.copy(form)
    };

    webix.ui(the_window);
    $$("window").show();
    $$("log_form").elements.username.focus();
});
