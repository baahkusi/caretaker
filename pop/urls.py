from django.conf.urls import url,include
from . import views

app_name = "pop"

dpatterns = [
    url(r'^cashpurchase$',views.DeleteCashPurchase.as_view()),
    url(r'^cashpurchasereturn$',views.DeleteCashPurchaseReturn.as_view()),
    url(r'^creditpurchase$',views.DeleteCreditPurchase.as_view()),
    url(r'^creditpurchasereturn$',views.DeleteCreditPurchaseReturn.as_view()),
]

upatterns = [
    url(r'^creditpurchase/(?P<pk>[0-9]+)$',views.UpdateCreditPurchase.as_view(),name='update-creditpurchase'),
    url(r'^cashpurchase/(?P<pk>[0-9]+)$',views.UpdateCashPurchase.as_view(),name='update-cashpurchase'),
    url(r'^creditpurchasereturn/(?P<pk>[0-9]+)$',views.UpdateCreditPurchaseReturn.as_view(),name='update-creditpurchasereturn'),
    url(r'^cashpurchasereturn/(?P<pk>[0-9]+)$',views.UpdateCashPurchaseReturn.as_view(),name='update-cashpurchasereturn'),
]

cpatterns = [
    url(r'^creditpurchase$',views.CreateCreditPurchase.as_view(),name='create-creditpurchase'),
    url(r'^cashpurchase$',views.CreateCashPurchase.as_view(),name='create-cashpurchase'),
    url(r'^creditpurchasereturn$',views.CreateCreditPurchaseReturn.as_view(),name='create-creditpurchasereturn'),
    url(r'^cashpurchasereturn$',views.CreateCashPurchaseReturn.as_view(),name='create-cashpurchasereturn'),
]

qpatterns = [
    url(r'^creditpurchases$',views.CreditPurchases.as_view(),name='creditpurchases'),
    url(r'^cashpurchases$',views.CashPurchases.as_view(),name='cashpurchases'),
    url(r'^creditpurchasereturns$',views.CreditPurchaseReturns.as_view(),name='creditpurchasereturns'),
    url(r'^purchasereturns$',views.CashPurchaseReturns.as_view(),name='cashpurchasereturns'),
]

hpatterns = [
    url(r'^settle$',views.SettlePurchase.as_view(),name='settle'),
]

apiv1 = [
    url(r'^update/',include(upatterns)),
    url(r'^delete/',include(dpatterns)),
    url(r'^create/',include(cpatterns)),
    url(r'^query/',include(qpatterns)),
    url(r'^helpers/',include(hpatterns)),
]

apps = [
    url(r'^purchases/cash$',views.AppInitP.as_view(),name="cashpurchases"),
    url(r'^purchases/credit$',views.AppInitPC.as_view(),name="creditpurchases"),
    url(r'^returns/cash$',views.AppInitR.as_view(),name="cashreturns"),
    url(r'^returns/credit$',views.AppInitRC.as_view(),name="creditreturns"),
]

urlpatterns = [
    url(r'^',include(apps)),
    url(r'^apiv1/',include(apiv1)),
]
