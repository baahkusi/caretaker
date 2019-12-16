
var pop_datatable = {
    padding:20,
    cols:[
        {
            view: "datatable",
            id:"pop_datatable",
            select:"row",
            math:true,
            editable: true,
            editaction: "dblclick",
            footer:true,
            select:true,
            columns:[
                {id:"name", header:"Item / Product",fillspace:true,footer:"Sub Total :"},
                {id:"order_qty", header:"Quantity",fillspace:true,editor:"text"},
                {id:"cp", header:"Unit CP GH&#8373;",format:webix.i18n.numberFormat,fillspace:true, editor:"text"},
                {id:"sp", header:"Unit SP GH&#8373;",format:webix.i18n.numberFormat,fillspace:true, editor:"text"},
                {id:"amount", header:["Amount GH&#8373;"],format:webix.i18n.numberFormat,math:"[$r,cp]*[$r,order_qty]",footer:{content:"summColumn"},sort:"int",fillspace:true},
                {id:"comment", header:"Comment",fillspace:true,editor:"text"},
                {id:"action", header:"Action",template:"{common.delButt}",fillspace:true},
            ],
            on:{
                onBeforLoad:function(){
                    this.showOverlay("Loading data ...");
                },
                onAfterLoad:function(){
                    this.hideOverlay();
                },
                onBeforeEditStop:function(state,editor,updated){
                    if (parseInt(state.value)<=0) {
                        webix.alert("Invalid input can't be 0 or below","alert-error");
                        return false;
                    }else{
                        $$("get_product").focus();
                        // webix.message("No problem");
                    }
                }
                // onEnter:function(e){
                //     console.log(e);
                //     rowID = parseInt($$("pop_datatable").getSelectedId());
                //     webix.message("enterkey"+rowID);
                //     $$("pop_datatable").editCell(rowID,"order_qty",false,true);
                //     return true;
                // }
            },
            type:{
                delButt:`<button type="button" class="delButt"><span class="webix_icon fa-trash"></span> Remove</button>`
            },
            onClick:{
                delButt:function(e,id,trg){
                    // webix.message("deleting row"+id);
                    $$("pop_datatable").remove(id);
                    $$("get_product").focus();
                }
            }
        }
    ]
}
