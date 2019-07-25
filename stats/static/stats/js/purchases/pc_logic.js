
var pc_logic = {
    current_report:null,
    filters:['product','cash','user'],
    day_sort:function (a,b) {
        return a.day-b.day;
    },
    week_sort:function (a,b) {
        if (a.year < b.year) {
            return -1;
        }
        if (a.year > b.year) {
            return 1;
        }
        if (a.year == b.year) {
            if (a.week < b.week) {
                return -1;
            }
            if (a.week > b.week) {
                return 1;
            }
            return 0;
        }
    },
    month_sort:function (a,b) {
        if (a.year < b.year) {
            return -1;
        }
        if (a.year > b.year) {
            return 1;
        }
        if (a.year == b.year) {
            if (a.month < b.month) {
                return -1;
            }
            if (a.month > b.month) {
                return 1;
            }
            return 0;
        }
    },
    year_sort:function (a,b) {
        return a.year - b.year;
    },
    init:function (a,b) {

    },
    showReport:function(reporter,report,charts,uri,filters,sortLike,load){
        if (pc_logic.current_report) {
            $$('report_window_body').removeView(pc_logic.current_report);
        }
        $$('report_window_body').addView(reporter,0);
        $$('report_window').show();
        pc_logic.current_report = report;
        this.filterReport(report,charts,uri,filters,sortLike);
        this.loadFilters(report,load);
    },
    filterReport:function(report,charts,uri,filters,sortLike){
        webix.ajax().get(uri,filters,function(txt,resp) {
            data = resp.json();
            $$(report+'_dt').clearAll();
            $$(report+'_dt').parse(data);
            var dsor = data.sort(sortLike);
            for (var chart of charts) {
                $$(report+chart+'_chart').clearAll();
                $$(report+chart+'_chart').parse(dsor);
            }
        });
    },
    loadFilters:function (report,filters) {
        if (filters.includes('product')) {
            var product_list = $$(report+"_get_product").getPopup().getList();
            product_list.clearAll();
            product_list.load("/inventory/apiv1/helpers/getproductidface");
        }
        if (filters.includes('cash')) {
            var pay_list = $$(report+"_payment_method").getPopup().getList();
            pay_list.clearAll();
            pay_list.load("/cash/apiv1/helpers/systems");
        }
        if (filters.includes('user')) {
            var user_list = $$(report+"_get_user").getPopup().getList();
            user_list.clearAll();
            user_list.load("/access/user/id");
        }
    },
    collectFilters:function (report,filters) {
        filter = {};
        if (filters.includes('product')) {
            var product = $$(report+"_get_product").getValue();
            if (product) {
                filter.product = product;
            }
        }
        if (filters.includes('cash')) {
            var pay = $$(report+"_payment_method").getValue();
            if (pay) {
                filter.pay = pay;
            }
        }
        if (filters.includes('user')) {
            var user = $$(report+"_get_user").getValue();
            if (user) {
                filter.user = user;
            }
        }
        var start = $$(report+"_start").getValue();
        if (start) {
            filter.start = start;
        }

        var end = $$(report+"_end").getValue();
        if (end) {
            filter.end = end;
        }
        return filter;
    }
}
