#from escpos import printer

#eps = printer.Usb(0x4b8,0x0e03)

# Headers Titles
ITEM_TITLE = 'ITEM(S)'
QTY_TITLE = 'QTY'
SP_TITLE = 'SP'
TOTAL_TITLE = 'TOTAL'


# Headers Keys
ITEM = 'product_name'
QTY = 'quantity'
SP = 'sp'


#Property Titles
CUSTOMER = 'CUSTOMER NAME'
CASHIER = 'CASHIER NAME'
DATE = 'ISSUED ON'
TOTAL_TXT = 'TOTAL AMOUNT : '
TEL = 'TEL : '
LOC = 'LOCATION : '
CURRENCY_NAME_TITLE = 'CURRENCY'


#Opts Keys
COMPANY_LOGO = 'clogo'
COMPANY_NAME = 'cname'
COMPANY_CONTACT = 'cinfo'
COMPANY_LOCATION = 'cloc'
RECEIPT_NAME = 'rname'
RECEIPT_NUMBER = 'rno'
CUSTOMER_NAME = 'customer'
CASHIER_NAME = 'cashier'
RECEIPT_DATE = 'rdate'
CURRENCY_NAME = 'currency'


# Chars
STAR_CHAR = '*'
SPACE_CHAR = ' '
LINE_BREAK = '\n'
ELIPSES = '... '
SN_RULER = '-'
DO_RULER = '='
HASH_NO = '#'
COLON_CHAR = ':'


# Widths
PAPER_MAX_WIDTH = 48
ITEM_MAX_WIDTH = int((28/48)*PAPER_MAX_WIDTH)
ITEM_TITLE_SPACE_AFTER = ITEM_MAX_WIDTH - len(ITEM_TITLE)

QTY_MAX_WIDTH = int((6/48)*PAPER_MAX_WIDTH)
QTY_TITLE_SPACE_AFTER = QTY_MAX_WIDTH - len(QTY_TITLE)

SP_MAX_WIDTH = int((6/48)*PAPER_MAX_WIDTH)
SP_TITLE_SPACE_AFTER = SP_MAX_WIDTH - len(SP_TITLE)

TOTAL_MAX_WIDTH = int((8/48)*PAPER_MAX_WIDTH)
TOTAL_TITLE_SPACE_AFTER = TOTAL_MAX_WIDTH - len(TOTAL_TITLE)

TOTAL_TXT_WIDTH = len(TOTAL_TXT)

LEFT_PROPERTY_WIDTH = int((15/48)*PAPER_MAX_WIDTH)
LR_ALIGN = int((2/48)*PAPER_MAX_WIDTH)
RIGH_VALUE_WIDTH = PAPER_MAX_WIDTH - LEFT_PROPERTY_WIDTH + LR_ALIGN

ELIPSES_WIDTH = len(ELIPSES)

def str_2_num(strin):
    return float(strin) if '.' in strin else int(strin)

class Receipt:

    def __init__(self):
        self._receipt = ""

    def print_header(self,opts):
        """Responsible for printing the header part of the receipt,
           :param:opts: include all options that could go into the
           header like logo, company name and all that
        """
        if COMPANY_LOGO in opts.keys():
            self.imgesprint(opts[COMPANY_LOGO])
            self.esprint(LINE_BREAK)

        if COMPANY_NAME in opts.keys():
            self.esprint(opts[COMPANY_NAME])
            self.esprint(LINE_BREAK)

        if COMPANY_CONTACT in opts.keys():
            self.esprint(TEL)
            self.esprint(opts[COMPANY_CONTACT])
            self.esprint(LINE_BREAK)

        if COMPANY_LOCATION in opts.keys():
            self.esprint(LOC)
            self.esprint(opts[COMPANY_LOCATION])
            self.esprint(LINE_BREAK)

        self.n_char(SN_RULER,PAPER_MAX_WIDTH,w=1,h=1)
        self.esprint(LINE_BREAK)

        if RECEIPT_NAME in opts.keys():
            RNO = opts[RECEIPT_NUMBER] if RECEIPT_NUMBER in opts.keys() else ''
            RECEIPT = opts[RECEIPT_NAME]+SPACE_CHAR+HASH_NO+RNO
            self.cesprint(RECEIPT)
            char = len(RECEIPT)
            self.cesprint(self.n_char_generate(DO_RULER,char))
            self.esprint(LINE_BREAK)

        if CUSTOMER_NAME in opts.keys():
            self.lesprint(CUSTOMER,LEFT_PROPERTY_WIDTH)
            self.esprint(COLON_CHAR)
            self.n_char(SPACE_CHAR,LR_ALIGN)
            self.esprint(opts[CUSTOMER_NAME])
            self.esprint(LINE_BREAK)

        if CASHIER_NAME in opts.keys():
            self.lesprint(CASHIER,LEFT_PROPERTY_WIDTH)
            self.esprint(COLON_CHAR)
            self.n_char(SPACE_CHAR,LR_ALIGN)
            self.esprint(opts[CASHIER_NAME])
            self.esprint(LINE_BREAK)

        if RECEIPT_DATE in opts.keys():
            self.lesprint(DATE,LEFT_PROPERTY_WIDTH)
            self.esprint(COLON_CHAR)
            self.n_char(SPACE_CHAR,LR_ALIGN)
            self.esprint(opts[RECEIPT_DATE])
            self.esprint(LINE_BREAK)

        if CURRENCY_NAME in opts.keys():
            self.lesprint(CURRENCY_NAME_TITLE,LEFT_PROPERTY_WIDTH)
            self.esprint(COLON_CHAR)
            self.n_char(SPACE_CHAR,LR_ALIGN)
            self.esprint(opts[CURRENCY_NAME])
            self.esprint(LINE_BREAK)

    def print_items(self,items):
        """Responsible for printing the receipt part of
           the receipt.
        """
        self.n_char(SN_RULER,PAPER_MAX_WIDTH,w=1,h=1)
        self.esprint(LINE_BREAK)
        self.esprint(ITEM_TITLE)
        self.n_char(SPACE_CHAR,ITEM_TITLE_SPACE_AFTER)
        self.esprint(QTY_TITLE)
        self.n_char(SPACE_CHAR,QTY_TITLE_SPACE_AFTER)
        self.esprint(SP_TITLE)
        self.n_char(SPACE_CHAR,SP_TITLE_SPACE_AFTER)
        self.esprint(TOTAL_TITLE)
        self.n_char(SPACE_CHAR,TOTAL_TITLE_SPACE_AFTER)
        self.esprint(LINE_BREAK)
        self.n_char(DO_RULER,PAPER_MAX_WIDTH,w=1,h=1)
        self.esprint(LINE_BREAK)
        sum_total = 0
        for item in items:
            product = item[ITEM] if len(item[ITEM]) < ITEM_MAX_WIDTH else item[ITEM][:ITEM_MAX_WIDTH-ELIPSES_WIDTH]+ELIPSES
            qty = item[QTY] if isinstance(item[QTY],int) else  round(str_2_num(item[QTY]),2)
            price = round(str_2_num(item[SP]),2)
            total = round(qty*price,2)
            sum_total += total
            self.print_space(product,ITEM_MAX_WIDTH)
            self.print_space(str(qty),QTY_MAX_WIDTH)
            self.print_space(str(price),SP_MAX_WIDTH)
            self.print_space(str(total),TOTAL_MAX_WIDTH)
            self.esprint(LINE_BREAK)
        self.n_char(SN_RULER,PAPER_MAX_WIDTH,w=1,h=1)
        self.esprint(LINE_BREAK)
        self.esprint(TOTAL_TXT)
        leave = TOTAL_TXT_WIDTH
        self.n_char(SPACE_CHAR,PAPER_MAX_WIDTH-TOTAL_MAX_WIDTH-leave,w=1,h=1)
        self.esprint(str(sum_total))
        self.esprint(LINE_BREAK)
        self.n_char(DO_RULER,PAPER_MAX_WIDTH,w=1,h=1)
        self.esprint(LINE_BREAK)

    def print_message(self,msg):
        self.cesprint(msg,char=STAR_CHAR)
        self.esprint(LINE_BREAK)

    def print_vat(self,vmsg):
        self.esprint(LINE_BREAK)
        self.cesprint(vmsg)
        self.esprint(LINE_BREAK)

    def print_me(self,me):
        self.resprint(me)

    def print_space(self,text,width,w=1,h=1):
        """Print text and then print space character
        for remaining space = width - texlen. For now texlen is not expected
        to be greater than width, if so just truncate to width.
        """
        texlen = len(text)
        if texlen > width:
            text = text[:width]
        self.lesprint(text,width)

    def imgesprint(self,path,align='center'):
        """Responsible for image printing"""
        if align == 'left':
            self.lesprint(path)
        elif align == 'right':
            self.resprint(path)
        else:
            self.cesprint(path)

    def esprint(self,text,w=1,h=1):
        """A prudent wrapper around printing text with [eps.text()]"""
        # print(text,end='')
        self._receipt += text

    def cesprint(self,text,width=PAPER_MAX_WIDTH,char=SPACE_CHAR,w=1,h=1):
        """center align text and fill space left with :param:char:"""
        texlen = len(text)
        if texlen > width:
            diff = width % texlen
        else:
            diff = width - texlen
        if diff == 0:
            ldiff = rdiff = 0
        elif diff % 2 == 0:
            ldiff = rdiff = diff//2
        else:
            ldiff = diff//2
            rdiff = ldiff+1
        self.n_char(char,ldiff,w,h)
        self.esprint(text)
        self.n_char(char,rdiff,w,h)

    def resprint(self,text,width=PAPER_MAX_WIDTH,char=SPACE_CHAR,w=1,h=1):
        """right align text and fill space left with :param:char:"""
        texlen = len(text)
        diff = width - texlen
        self.n_char(char,diff,w,h)
        self.esprint(text,w,h)

    def lesprint(self,text,width=PAPER_MAX_WIDTH,char=SPACE_CHAR,w=1,h=1):
        """light align text and fill space left with :param:char:"""
        texlen = len(text)
        diff = width - texlen
        self.esprint(text,w,h)
        self.n_char(char,diff,w,h)

    def n_char(self,char,n,w=1,h=1):
        """Print char n times"""
        for i in range(n):
            self.esprint(char,w,h)

    def n_char_generate(self,char,n):
        """ Return string of char n time"""
        return char*n

    def get_longest_item(self,items):
        """Return the length of the longest
           Item name in the list of items
        """
        # Assume longest is initially zero
        longest = 0
        for item in items:
            # get length of item name
            length = len(item[ITEM])
            if length > longest:
                longest = length
        return longest
