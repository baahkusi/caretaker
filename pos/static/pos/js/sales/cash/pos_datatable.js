
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
                {id:"name", header:"Item / Product",fillspace:true,footer:"Sub Total :"},
                {id:"order_qty", header:"Quantity",fillspace:true,editor:"text"},
                {id:"sp", header:"Unit Price GH&#8373;",fillspace:true},
                {id:"amount", header:["Amount GH&#8373;"],math:"[$r,sp]*[$r,order_qty]",footer:{content:"summColumn"},sort:"int",fillspace:true},
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
                    min_stock = $$("pos_datatable").getItem(editor.row).min_stock
                    quantity = $$("pos_datatable").getItem(editor.row).quantity
                    unit = $$("pos_datatable").getItem(editor.row).unit_of_measure
                    if (parseInt(state.value)>quantity) {
                        webix.alert("Quantity on hand "+quantity+unit+" is not enough to satisfy this order "+state.value+unit,"alert-error");
                        return false;
                    }else{
                        $$("get_product").focus();
                        // webix.message("No problem");
                    }
                }
                // onEnter:function(e){
                //     console.log(e);
                //     rowID = parseInt($$("pos_datatable").getSelectedId());
                //     webix.message("enterkey"+rowID);
                //     $$("pos_datatable").editCell(rowID,"order_qty",false,true);
                //     return true;
                // }
            },
            type:{
                delButt:`<button type="button" class="delButt"><span class="webix_icon fa-trash"></span> Remove</button>`
            },
            onClick:{
                delButt:function(e,id,trg){
                    console.log(e);
                    console.log(trg);
                    // webix.message("deleting row"+id);
                    $$("pos_datatable").remove(id);
                    $$("get_product").focus();
                }
            }
        }
    ]
}
