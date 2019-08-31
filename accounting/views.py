import datetime
from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
# These views loads in the apps
@method_decorator(access_required('income'), name='dispatch')
class AppIncome(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'accounting/income.html'

@method_decorator(access_required('expenses'), name='dispatch')
class AppExpenses(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'accounting/expenses.html'


