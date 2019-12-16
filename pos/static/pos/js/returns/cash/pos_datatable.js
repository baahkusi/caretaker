
var pos_datatable = {
    padding:20,
    cols:[
        {
            view: "datatable",
            id:"pos_datatable",
            select:"row",
            math:true,
            editable: true,
            editaction: "dblclick",
            footer:true,
            select:true,
            columns:[
                {id:"product_id", header:"#",hidden:true},
                {id:"product_name", header:"Item / Product",fillspace:true,footer:"Sub Total :"},
                {id:"old_quantity", header:"Quantity Sold",fillspace:true},
                {id:"quantity", header:"Quantity to be Returned",fillspace:true,editor:"text"},
                {id:"sp",format:webix.i18n.numberFormat, header:"Unit Price GH&#8373;",fillspace:true},
                {id:"amount",format:webix.i18n.numberFormat, header:["Amount GH&#8373;"],math:"[$r,sp]*[$r,quantity]",footer:{content:"summColumn"},sort:"int",fillspace:true},
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

                    old_quantity = $$("pos_datatable").getItem(editor.row).old_quantity;
                    console.log(old_quantity);
                    var cval = parseInt(state.value);
                    if (cval>old_quantity) {
                        webix.alert("I can't return more than what was sold","alert-error");
                        return false;
                    }else if(cval==0){
                        webix.alert("0 means that none of this item  is being returned, consider removing it, or i will remove it anyway.","alert-warning");
                    }else if(cval<0){
                        webix.alert("Quantity Can't be below 0","alert-error");
                        return false;
                    }else{
                        // webix.message("No problem");
                    }
                }
            },
            type:{
                delButt:`<button type="button" class="delButt"><span class="webix_icon fa-trash"></span> Remove</button>`
            },
            onClick:{
                delButt:function(e,id,trg){
                    $$("pos_datatable").remove(id.row);
                }
            }
        }
    ]
}
