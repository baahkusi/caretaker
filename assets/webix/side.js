var side = {
	id:"side",
	view: "sidebar",
	width:220,
	url:"/access/",
	collapsed:true,
	on:{
		onAfterSelect: function(id){
			console.log(this.getItem(id));
			webix.message(this.getItem(id).value)
			window.location = this.getItem(id).url;
		}
	}
}

var toolbar = {
	 view:"toolbar",
	 id:"toolbar",
	 cols:[
		 {view: "button", type: "icon", icon: "bars",
			 width: 37, align: "left", css: "app_button", click: function(){
				 $$("side").toggle()
			 }
		 },
		 {view:"label",label:"<b>Caretaker Point of Sales v2.0 by SBKSoftwares</b>"},
		 {},
		 {
			 view:"icon",
			 icon:"user-circle",
			 popup:{
			    view:"popup",
			    id:"menu_popup",
			    scroll: false,
			    borderless:true,
			    head:"Submenu",
			    template: "<span class='webix_icon fa-#icon#'></span> #value#",
			    body:{
			        view:"list",
			        select:true,
			        autoheight:true,
			        data:[
			            {icon:"home",value:"Home",url:"/access/home"},
			            {icon:"sign-out",value:"Logout",url:"/"}
			        ],
			        on:{
			            onItemClick:function(id){
			                var item = this.getItem(id);
			                // webix.message(item.url);

			                if (item.value=="Logout") {
			                    webix.ajax().post("/access/logout",function(txt,resp){
			                        msg = resp.json();
			                        if (msg.status) {
			                            window.location = item.url;
			                        }
			                    })
			                }else{
			                    window.location = item.url;
			                }
			            }
			        }
			    }
			}
		}
	]
 }
