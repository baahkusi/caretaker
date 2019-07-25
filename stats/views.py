from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from pos.forms import (CreditSale,CashSale,
                        CreditSalesReturn,CashSalesReturn)
from pop.models import (CreditPurchase,CashPurchase,
                        CreditPurchaseReturn,CashPurchaseReturn)
from stats.periodic import (DailySaleRecord,DailyPurchaseRecord,
                            WeeklySaleRecord,WeeklyPurchaseRecord,
                            MonthlySaleRecord,MonthlyPurchaseRecord,
                            YearlySaleRecord,YearlyPurchaseRecord)
from stats.categoric import (ProdSaleRecord,ProdPurchaseRecord,
                            UserSaleRecord,UserPurchaseRecord,
                            PaySaleRecord,PayPurchaseRecord)
from stats.export import some_pdf
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
# These views loads in the apps
@method_decorator(access_required('statsPurch'), name='dispatch')
class AppInitP(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'stats/purchases.html'

@method_decorator(access_required('statsSales'), name='dispatch')
class AppInitS(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'stats/sales.html'

# Daily Records
class DailyCashS(DailySaleRecord):
    model = CashSale

class DailyCashSr(DailySaleRecord):
    model = CashSalesReturn

class DailyCashPc(DailyPurchaseRecord):
    model = CashPurchase

class DailyCashPr(DailyPurchaseRecord):
    model = CashPurchaseReturn

class DailyCreditS(DailySaleRecord):
    model = CreditSale

class DailyCreditSr(DailySaleRecord):
    model = CreditSalesReturn

class DailyCreditPc(DailyPurchaseRecord):
    model = CreditPurchase

class DailyCreditPr(DailyPurchaseRecord):
    model = CreditPurchaseReturn

# Weekly Records
class WeeklyCashS(WeeklySaleRecord):
    model = CashSale

class WeeklyCashSr(WeeklySaleRecord):
    model = CashSalesReturn

class WeeklyCashPc(WeeklyPurchaseRecord):
    model = CashPurchase

class WeeklyCashPr(WeeklyPurchaseRecord):
    model = CashPurchaseReturn

class WeeklyCreditS(WeeklySaleRecord):
    model = CreditSale

class WeeklyCreditSr(WeeklySaleRecord):
    model = CreditSalesReturn

class WeeklyCreditPc(WeeklyPurchaseRecord):
    model = CreditPurchase

class WeeklyCreditPr(WeeklyPurchaseRecord):
    model = CreditPurchaseReturn

# Monthly Records
class MonthlyCashS(MonthlySaleRecord):
    model = CashSale

class MonthlyCashSr(MonthlySaleRecord):
    model = CashSalesReturn

class MonthlyCashPc(MonthlyPurchaseRecord):
    model = CashPurchase

class MonthlyCashPr(MonthlyPurchaseRecord):
    model = CashPurchaseReturn

class MonthlyCreditS(MonthlySaleRecord):
    model = CreditSale

class MonthlyCreditSr(MonthlySaleRecord):
    model = CreditSalesReturn

class MonthlyCreditPc(MonthlyPurchaseRecord):
    model = CreditPurchase

class MonthlyCreditPr(MonthlyPurchaseRecord):
    model = CreditPurchaseReturn

# Yearly Records
class YearlyCashS(YearlySaleRecord):
    model = CashSale

class YearlyCashSr(YearlySaleRecord):
    model = CashSalesReturn

class YearlyCashPc(YearlyPurchaseRecord):
    model = CashPurchase

class YearlyCashPr(YearlyPurchaseRecord):
    model = CashPurchaseReturn

class YearlyCreditS(YearlySaleRecord):
    model = CreditSale

class YearlyCreditSr(YearlySaleRecord):
    model = CreditSalesReturn

class YearlyCreditPc(YearlyPurchaseRecord):
    model = CreditPurchase

class YearlyCreditPr(YearlyPurchaseRecord):
    model = CreditPurchaseReturn

# Product Records
class ProdCashS(ProdSaleRecord):
    model = CashSale

class ProdCashSr(ProdSaleRecord):
    model = CashSalesReturn

class ProdCashPc(ProdPurchaseRecord):
    model = CashPurchase

class ProdCashPr(ProdPurchaseRecord):
    model = CashPurchaseReturn

class ProdCreditS(ProdSaleRecord):
    model = CreditSale

class ProdCreditSr(ProdSaleRecord):
    model = CreditSalesReturn

class ProdCreditPc(ProdPurchaseRecord):
    model = CreditPurchase

class ProdCreditPr(ProdPurchaseRecord):
    model = CreditPurchaseReturn

# User Records
class UserCashS(UserSaleRecord):
    model = CashSale

class UserCashSr(UserSaleRecord):
    model = CashSalesReturn

class UserCashPc(UserPurchaseRecord):
    model = CashPurchase

class UserCashPr(UserPurchaseRecord):
    model = CashPurchaseReturn

class UserCreditS(UserSaleRecord):
    model = CreditSale

class UserCreditSr(UserSaleRecord):
    model = CreditSalesReturn

class UserCreditPc(UserPurchaseRecord):
    model = CreditPurchase

class UserCreditPr(UserPurchaseRecord):
    model = CreditPurchaseReturn

# Pay Records
class PayCashS(PaySaleRecord):
    model = CashSale

class PayCashSr(PaySaleRecord):
    model = CashSalesReturn

class PayCashPc(PayPurchaseRecord):
    model = CashPurchase

class PayCashPr(PayPurchaseRecord):
    model = CashPurchaseReturn

class ExportCashS(DailyCashS):
    export_data = True

    def make_export(self,data,headers):
        return some_pdf(data,headers)
