import datetime
from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from custom.views import (JSONCreateView,JSONUpdateView,JSONQueryGet,
                            JSONQueryView,JSONDeleteView)
from pos.models import (CreditSale,CreditSalesReturn,
                        CashSale,CashSalesReturn)
from pop.models import (CreditPurchase,CreditPurchaseReturn,
                        CashPurchase,CashPurchaseReturn)
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
from logger.helpers import prepare_changes_data
# These views loads in the apps
@method_decorator(access_required('pc_logger'), name='dispatch')
class AppInitPC(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'logger/pc_logger.html'

@method_decorator(access_required('pr_logger'), name='dispatch')
class AppInitPR(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'logger/pr_logger.html'

@method_decorator(access_required('sales_logger'), name='dispatch')
class AppInitS(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'logger/sales_logger.html'

@method_decorator(access_required('sr_logger'), name='dispatch')
class AppInitSR(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'logger/sr_logger.html'


# NOT_VOID = ['007', '600', '419', '212', '202']

class CashSales(JSONQueryView):
    model = CashSale
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CreditSales(JSONQueryView):
    model = CreditSale
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CreditSalesReturns(JSONQueryView):
    model = CreditSalesReturn
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CashSalesReturns(JSONQueryView):
    model = CashSalesReturn
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e)).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CashPurchases(JSONQueryView):
    model = CashPurchase
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CreditPurchases(JSONQueryView):
    model = CreditPurchase
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CreditPurchaseReturns(JSONQueryView):
    model = CreditPurchaseReturn
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class CashPurchaseReturns(JSONQueryView):
    model = CashPurchaseReturn
    accept_arg = True

    def make_query(self,ask=None):
        b = ask['b']
        e = ask['e']
        changes = list(self.model.objects.filter(timestamp__range=(b,e), is_voided=False).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
