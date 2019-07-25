from django.shortcuts import render
from django.views import generic,View
from tax.forms import TaxForm
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONDeleteView)
from tax.models import Tax


# This view loads in the app
class AppInit(generic.base.TemplateView):
    template_name = 'tax/index.html'

#Views for Tax model
#create view
class CreateTax(JSONCreateView):
    form = TaxForm
    model = Tax
#update view
class UpdateTax(JSONUpdateView):
    form = TaxForm
    model = Tax
#query view
class Taxs(JSONQueryView):
    model = Tax
