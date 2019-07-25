from custom.printer_test_web import text_print
from custom.eps_printer_test_web import dummy_print

def print_invoice(items, opts):
    text_print(items, opts)
