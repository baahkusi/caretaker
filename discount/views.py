from django.shortcuts import render
from django.views import generic,View
from discount.forms import DiscountForm
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONDeleteView)
from discount.models import Discount


# This view loads in the app
class AppInit(generic.base.TemplateView):
    template_name = 'discount/index.html'

#Views for Discount model
#create view
class CreateDiscount(JSONCreateView):
    form = DiscountForm
    model = Discount
#update view
class UpdateDiscount(JSONUpdateView):
    form = DiscountForm
    model = Discount
#query view
class Discounts(JSONQueryView):
    model = Discount
