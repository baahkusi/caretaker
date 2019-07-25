import json, os, random, datetime
from eps_printer import Receipt

curdir = os.path.dirname(os.path.abspath(__file__))
jsnf = os.path.join(curdir,'items.json')
jsn = open(jsnf)
items = json.load(jsn)
pics = ['clogo.png','heart.png','med.png','tux.jpg','user.png']
receipt = Receipt()
rno = str(random.randint(10000,1000000))
clogo = 'uploads/'+pics[0]
clogo = os.path.join(os.path.dirname(curdir),clogo)
opts = {
    'cname':'MANGO & PEAR ENTERPRISE LTD DEALERS IN FRUITS',
    'clogo':clogo,
    'cinfo':'0243337978 / 0245836125',
    'cloc':'KNUST, KUMASI',
    'rname':'Sales Receipt',
    'rno':rno,
    'customer':'YOU A YOU',
    'cashier':'ME AM ME',
    'currency':'GH CEDIS',
    'rdate':datetime.datetime.today().ctime(),
}
receipt.print_header(opts)
receipt.print_items(items)
receipt.print_message('THANKS FOR YOUR PATRONAGE')
receipt.print_vat('Amount is VAT INCLUSIVE')
receipt.print_me('Programmed by : SBKSoftwares Inc. : 0553339728')
receipt.esecute()
receipt.escut()
receipt.estop()
