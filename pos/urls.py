from django.conf.urls import url,include
from . import views

app_name = "pos"

dpatterns = [
    url(r'^cashsale$',views.DeleteCashSale.as_view()),
    url(r'^cashsalesreturn$',views.DeleteCashSalesReturn.as_view()),
    url(r'^creditsale$',views.DeleteCreditSale.as_view()),
    url(r'^creditsalesreturn$',views.DeleteCreditSalesReturn.as_view()),
]

upatterns = [
    url(r'^creditsale/(?P<pk>[0-9]+)$',views.UpdateCreditSale.as_view(),name='update-creditsale'),
    url(r'^cashsale/(?P<pk>[0-9]+)$',views.UpdateCashSale.as_view(),name='update-cashsale'),
    url(r'^creditsalesreturn/(?P<pk>[0-9]+)$',views.UpdateCreditSalesReturn.as_view(),name='update-creditsalesreturn'),
    url(r'^cashsalesreturn/(?P<pk>[0-9]+)$',views.UpdateCashSalesReturn.as_view(),name='update-cashsalesreturn'),
]

cpatterns = [
    url(r'^creditsale$',views.CreateCreditSale.as_view(),name='create-creditsale'),
    url(r'^cashsale$',views.CreateCashSale.as_view(),name='create-cashsale'),
    url(r'^creditsalesreturn$',views.CreateCreditSalesReturn.as_view(),name='create-creditsalesreturn'),
    url(r'^cashsalesreturn$',views.CreateCashSalesReturn.as_view(),name='create-cashsalesreturn'),
]

qpatterns = [
    url(r'^creditsales$',views.CreditSales.as_view(),name='creditsales'),
    url(r'^cashsales$',views.CashSales.as_view(),name='cashsales'),
    url(r'^creditsalesreturns$',views.CreditSalesReturns.as_view(),name='creditsalesreturns'),
    url(r'^cashsalesreturns$',views.CashSalesReturns.as_view(),name='cashsalesreturns'),
]

hpatterns = [
    url(r'^settle$',views.SettleSale.as_view(),name='settle'),
]

apiv1 = [
    url(r'^update/',include(upatterns)),
    url(r'^delete/',include(dpatterns)),
    url(r'^create/',include(cpatterns)),
    url(r'^query/',include(qpatterns)),
    url(r'^helpers/',include(hpatterns)),
]

apps = [
    url(r'^sales/cash$',views.AppInitS.as_view(),name="cashsales"),
    url(r'^sales/credit$',views.AppInitSC.as_view(),name="creditsales"),
    url(r'^returns/credit$',views.AppInitR.as_view(),name="creditsalereturns"),
    url(r'^returns/cash$',views.AppInitRC.as_view(),name="cashsalereturns"),
]

urlpatterns = [
    url(r'^',include(apps)),
    url(r'^apiv1/',include(apiv1)),
]
