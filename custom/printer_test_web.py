import json, os, random, datetime
from custom.printer import Receipt

def text_print(items, opts):
    # from escpos import printer
    # eps = printer.Usb(0x4b8,0x0e03)
    curdir = os.path.dirname(os.path.abspath(__file__))
    receipt = Receipt()
    # opts['clogo'] = clogo
    opts['cname'] = 'MANGO & PEAR ENTERPRISE LTD DEALERS IN FRUITS'
    opts['cinfo'] = '0243337978 / 0245836125'
    opts['cloc'] = 'KNUST, KUMASI'
    number = opts['rno']
    # time
    opts['rdate'] = string_to_date(opts['rdate'])
    receipt.print_header(opts)
    receipt.print_items(items)
    receipt.print_message('THANKS FOR YOUR PATRONAGE')
    receipt.print_vat('Amount is VAT INCLUSIVE')
    receipt.print_me('Programmed by : SBKSoftwares Inc. : 0553339728')
    # eps.text(receipt._receipt)
    # eps.cut()
    receipts_dir = os.path.join(curdir,'receipts')
    if not os.path.exists(receipts_dir):
        os.mkdir(receipts_dir)

    receipt_name = 'r'+number+'.txt'
    with open(os.path.join(receipts_dir,receipt_name),'w') as rcpt:
        rcpt.write(receipt._receipt)

def string_to_date(string):
    date_time = string.split('T')
    date = tuple([int(x) for x in date_time[0].split('-')])
    time = tuple([int(x) for x in date_time[1].split('.')[0].split(':')])
    string = datetime.datetime(*date,*time).strftime('%a %b %d %I:%M:%S %p %Y')
    return string
