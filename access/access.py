

APPS = [
    {
        "id": 1,
        "icon": "cart-plus",
        "value": "POINT OF SALE",
        "app":"cashpos:creditpos",
        "data":[
    		{ "id": "cashpos", "value": "CASH","url": "/pos/sales/cash","app":"cashpos",},
    		{ "id": "creditpos", "value": "CREDIT","url": "/pos/sales/credit","app":"creditpos",}
    	]
    },
    {
        "id": 2,
        "icon": "cart-arrow-down",
        "value": "POINT OF PURCHASE",
        "app":"cashpop:creditpop",
        "data":[
    		{ "id": "cashpop", "value": "CASH","url": "/pop/purchases/cash","app":"cashpop",},
    		{ "id": "creditpop", "value": "CREDIT","url": "/pop/purchases/credit","app":"creditpop",}
    	]
    },
    {
        "id": 3,
        "icon": "undo",
        "value": "SALES RETURNS",
        "app":"cashsr:creditsr",
        "data":[
    		{ "id": "cashsr", "value": "CASH","url": "/pos/returns/cash","app":"cashsr",},
    		{ "id": "creditsr", "value": "CREDIT","url": "/pos/returns/credit","app":"creditsr",}
    	]
    },
    {
        "id": 4,
        "icon": "cube",
        "value": "PURCHASES RETURNS",
        "app":"cashpr:creditpr",
        "data":[
    		{ "id": "cashpr", "value": "CASH","url": "/pop/returns/cash","app":"cashpr",},
    		{ "id": "creditpr", "value": "CREDIT","url": "/pop/returns/credit","app":"creditpr",}
    	]
    },
    {
        "id": 5,
        "icon": "cubes",
        "value": "STOCK MANAGEMENT",
        "url": "/inventory",
        "app":"inventory",
    },
    {
        "id": 6,
        "icon": "pie-chart",
        "value": "REPORTS",
        "app":"statsPurch:statsSales",
        "data":[
            {"id": "statsSales","value": "SALES REPORTS","url": "/stats/sales","app":"statsSales",},
            {"id": "statsPurch","value": "PURCHASES REPORTS","url": "/stats/purchases","app":"statsPurch",},
        ]
    },
    {
        "id": 7,
        "icon": "money",
        "value": "CASH MANAGEMENT",
        "url": "/cash",
        "app":"cash",
    },
    {
        "id": 8,
        "icon": "clipboard",
        "value": "RECORDS",
        "app":"receipt:invoice",
        "data":[
            {"id": "receipt","value": "RECEIPT MANAGEMENT","url": "/receipt","app":"receipt",},
            {"id": "invoice","value": "INVOICE MANAGEMENT","url": "/invoice","app":"invoice",},
        ]
    },
    {
        "id": 9,
        "icon": "address-book",
        "value": "RELATIONS",
        "app":"customer:supplier",
        "data":[
            {"id": "customer","value": "CUSTOMER MANAGEMENT","url": "/customer","app":"customer",},
            {"id": "supplier","value": "SUPPLIER MANAGEMENT","url": "/supplier","app":"supplier",},
        ]
    },
    {
        "id": 11,
        "icon": "book",
        "value": "ACCOUNTING",
        "app":"accounting",
        "data":[
            {"id": "expenses","value": "EXPENSE TRACKER","url": "/expenses","app":"expenses",},
            {"id": "income","value": "INCOME STATEMENT","url": "/income","app":"income",},
        ]
    },
    {
        "id": 13,
        "icon": "edit",
        "value": "LOGS",
        "app":"pc_logger:pr_logger:sales_logger:sr_logger",
        "data":[
            {"id": "sales_logger","value": "SALES LOGGER","url": "/logger/s","app":"sales_logger",},
            {"id": "sr_logger","value": "SALES RETURNS LOGGER","url": "/logger/sr","app":"sr_logger",},
            {"id": "pc_logger","value": "PURCHASES LOGGER","url": "/logger/pc","app":"pc_logger",},
            {"id": "pr_logger","value": "PURCHASES RETURNS LOGGER","url": "/logger/pr","app":"pr_logger",},
        ]
    },
    {
        "id": 12,
        "icon": "user",
        "value": "USER MANAGEMENT",
        "url": "/access/user",
        "app":"user",
    },
    {
        "id": 14,
        "icon": "cog",
        "value": "SETTINGS",
        "url": "/settings",
        "app":"settings",
    }
]
