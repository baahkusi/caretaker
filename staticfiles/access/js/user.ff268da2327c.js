webix.ready(function(){

    var bussiness = document.getElementsByName('bussiness')[0].value;
    var branch = document.getElementsByName('branch')[0].value;

    function create_user(){
        var fdata = $$("user_form").getValues();
        fdata.username += '@'+bussiness+'-'+branch;
        if (fdata.password!=fdata.confirm) {
            webix.message("Passwords Don't Match","error");
        }else {
            url = "/access/user/create";
            webix.ajax().post(url,fdata,function(txt, resp){

                msg = resp.json();
                console.log(msg);
                if (msg.status) {
                    webix.message('New User Created');
                    $$("user_datatable").load("/access/user/query");
                    $$("the_user_window").hide();
                }else{
                    webix.message('Failed to Create New User');
                    console.log(msg);
                }
            });
        }
    }

    var user_form = {
        view:"form",
        id:"user_form",
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
                            $$("user_form").elements.password.focus();
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
                        var use = $$("user_form").elements.username.getValue();
                        if (use=="") {
                            $$("user_form").elements.username.focus();
                        }else if (this.getValue()=="") {

                        }else {
                            $$("user_form").elements.confirm.focus();
                        }
                    }
                }
            },
            {
                view:"text",
                type:"password",
                label:"Confirm Password",
                name:"confirm",
                required:true,
                on:{
                    onEnter:function(){
                        var use = $$("user_form").elements.username.getValue();
                        var pass = $$("user_form").elements.password.getValue();
                        if (use=="") {
                            $$("user_form").elements.username.focus();
                        }else if (pass=="") {
                            $$("user_form").elements.password.focus();
                        }else if (this.getValue()=="") {

                        }else {
                            create_user();
                        }
                    }
                }
            },
            { margin:5,
                cols:[
                    {
                        view:"button",
                        value:"Create" ,
                        type:"form",
                        click:function(){
                            create_user();
                        }
                    },
                    {
                        view:"button",
                        value:"Close",
                        click:function(){
                            $$("the_user_window").hide();
                        }
                    }
                ]
            }
        ]
    }

    var the_user_window = {
        view:"window",
        id:"the_user_window",
        width:300,
        position:"center",
        modal:true,
        head:{
            cols:[

                {
                    template:"New User Form",
                    type:"header",
                }
            ]
        } ,
        body:webix.copy(user_form)
    }

    var user_datatable = {
        view: "datatable",
        id:"user_datatable",
        url:"/access/user/query",
        select:"row",
        editable: true,
    	editaction: "dblclick",
        save:{
            update:"/access/user/update",
        },
        columns:[
            {id:"id", header:"#"},
            {id:"username", header:"Username",sort:"text",fillspace:2},
            {id:"first_name", header:"First Name",editor:"text",fillspace:2},
            {id:"last_name", header:"Last Name",editor:"text",fillspace:2},
            {id:"email", header:"Email",editor:"text",fillspace:3},
            {id:"last_login",header:"Last Login Date (mm/dd/yyyy)",format:webix.i18n.dateFormatStr,fillspace:2},
            {id:"last_login_time", header:"Last Login Time",fillspace:2},
            {id:"register_date",header:"Register Date (mm/dd/yyyy)",format:webix.i18n.dateFormatStr,fillspace:2},
            {id:"register_time", header:"Register Time",fillspace:2},
        ],
        on:{
            onBeforLoad:function(){
                this.showOverlay("Loading data ...");
            },
            onAfterLoad:function(){
                this.hideOverlay();
            },
			onItemClick:function(id,e,node){
				if (id.column=="id") {
					$$("perm_list").load("/access/apps");
                    access = $$("user_datatable").getItem(id.row).access;
                    $$("perm_list").setValue(access);
                    $$("user_window").user_id=id.row;
					$$("user_window").show();
				}else {

				}
			}
        },
    }

    var user_window = {
        view:"window",
        id:"user_window",
        width:800,
        height:500,
        user_id:null,
        move:true,
        position:"center",
        resize: true,
        scrollY:true,
        head:{
    		cols:[
    			{
                    template:"User Permissions Management",
                    type:"header"
                },
    			{
    				view:"button", label:"Close", width:70, click:("$$('user_window').hide();"),align:"right"
    			}
    		]
    	},
        body:{
            view:"scrollview",
            scroll:"y",
            body:{
            rows:[
                    {
                    view:"dbllist",
                    id:"perm_list",
                    list:{
                        autoheight: true,
                        select: false,
                        template:function(obj, common){
                          var dir = (common.id  === "left" ? "right" : "left");
                          return obj.value + "<span class='select_one webix_icon fa-arrow-"+dir+"'></span>"
                        },
                        onClick:{
                          "select_one":function(e, id){
                             var mode = this.config.$id === "left";
                             this.getTopParentView().select(id, mode);
                             return false;
                          }
                        }
                    },
                    buttons:false,
                    labelLeft:"Access Denied",
                    labelRight:"Access Allowed",
                    labelBottomLeft:"Click on the arrow to select",
                    labelBottomRight:"Click on the arrow to reverse",
                    data:[]
                },
                {
                    padding:5,
                    cols:[
                        {},
                        {
                            view:"button",
                            type:"iconButton",
                            label:"Save",
                            icon:"save",
                            click:function(){
                                perms = $$("perm_list").getValue();
                                console.log(perms);
                                data = {};
                                data['access'] = perms;
                                data['id'] = $$("user_window").user_id;
                                url = "/access/user/access";
                                console.log(data);
                                webix.ajax().post(url,data,function(tx,res){
                                    msg = res.json();
                                    if (msg.status) {
                                        webix.message("user has new Permissions");
                                        $$("user_datatable").load("/access/user/query");
                                    }
                                })
                            }
                        },
                        {}
                    ]

                }
            ]
        }
        }
    }

    var user_buttons = {
        type:"space",
        padding:10,
        cols:[
            {
                view:"button",
                type:"iconButton",
                label:"Add User",
                icon:"user-plus",
                autowidth:true,
                click:function() {
                    $$("the_user_window").getBody().clear();
                    $$("the_user_window").show();
                    $$("the_user_window").getBody().focus();
                }
            },
            {
                view:"button",
                type:"iconButton",
                label:"Remove User",
                icon:"trash",
                autowidth:true,
                click:function() {
                    var prc = $$("user_datatable").getSelectedItem();
                    if (prc){
                        webix.confirm({
                            title: "Delete",
                            ok:"Yes", cancel:"No",
                            text:"Are you sure you want to delete this user",
                            type:"confirm-warning",
                            callback:function(result){
                                if (result) {
                                    webix.ajax().post("/access/user/delete/"+prc.id,function(text,response){
                                        msg = response.json();
                                        if (msg.status){
                                            $$("user_datatable").remove(prc.id);
                                            webix.message(msg.msg);
                                        }else{
                                            webix.message(msg.msg,'error');
                                        }
                                    });
                                }else{
                                    // console.log(result);
                                }
                            }
                        });
                    }else{
                        webix.message("No row is selected","error");
                        webix.message("Select a row by clicking on it");
                    }
                }
            },
            {
                view:"button",
                type:"iconButton",
                label:"Manage Permissions",
                icon:"user-secret",
                autowidth:true,
                click:function() {
                    var prc = $$("user_datatable").getSelectedItem();
                    console.log(prc);
                    if (prc){
                        $$("perm_list").load("/access/apps");
                        access = prc.access;
                        $$("perm_list").setValue(access);
                        $$("user_window").user_id=prc.id;
                        $$("user_window").show();
                    }else{
                        webix.message("No row is selected","error");
                        webix.message("Select a row by clicking on it");
                    }
                }
            },{}
        ]
    }

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
                                template:"User Creation and Permissions Management",
                                type:"header"
                            },
                            user_buttons,
                            user_datatable
                        ]
                    }
                ]
            }

        ]
    });

    // windows
    webix.ui(user_window);
    webix.ui(the_user_window);

});
