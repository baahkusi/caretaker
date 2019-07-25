from django.conf.urls import url,include
from . import views

app_name = "logger"

hpatterns = [
    url(r'^cash/sales$',views.CashSales.as_view()),
    url(r'^credit/sales$',views.CreditSales.as_view()),
    url(r'^cash/sr$',views.CashSalesReturns.as_view()),
    url(r'^credit/sr$',views.CreditSalesReturns.as_view()),
    url(r'^cash/pc$',views.CashPurchases.as_view()),
    url(r'^credit/pc$',views.CreditPurchases.as_view()),
    url(r'^cash/pr$',views.CashPurchaseReturns.as_view()),
    url(r'^credit/pr$',views.CreditPurchaseReturns.as_view()),
]

apiv1 = [
    url(r'^helpers/',include(hpatterns)),
]

urlpatterns = [
    url(r'^s$',views.AppInitS.as_view()),
    url(r'^sr$',views.AppInitSR.as_view()),
    url(r'^pc$',views.AppInitPC.as_view()),
    url(r'^pr$',views.AppInitPR.as_view()),
    url(r'^apiv1/',include(apiv1)),
]
