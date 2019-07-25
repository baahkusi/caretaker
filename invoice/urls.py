from django.conf.urls import url,include
from . import views

app_name = "invoice"

upatterns = [
    url(r'^salesinvoice/(?P<pk>[0-9]+)$',views.UpdateSalesInvoice.as_view(),name='update-salesinvoice'),
    url(r'^salesreturninvoice/(?P<pk>[0-9]+)$',views.UpdateSalesReturnInvoice.as_view(),name='update-salesreturninvoice'),
    url(r'^purchasesinvoice/(?P<pk>[0-9]+)$',views.UpdatePurchaseInvoice.as_view(),name='update-purchasesinvoice'),
    url(r'^purchasesreturninvoice/(?P<pk>[0-9]+)$',views.UpdatePurchaseReturnInvoice.as_view(),name='update-purchasesreturninvoice'),
]

cpatterns = [
    url(r'^salesinvoice$',views.CreateSalesInvoice.as_view(),name='create-salesinvoice'),
    url(r'^salesreturninvoice$',views.CreateSalesReturnInvoice.as_view(),name='create-salesreturninvoice'),
    url(r'^purchasesinvoice$',views.CreatePurchaseInvoice.as_view(),name='create-purchasesinvoice'),
    url(r'^purchasesreturninvoice$',views.CreatePurchaseReturnInvoice.as_view(),name='create-purchasesreturninvoice'),
]

qpatterns = [
    url(r'^salesinvoices$',views.SalesInvoices.as_view(),name='salesinvoices'),
    url(r'^salesreturninvoices$',views.SalesReturnInvoices.as_view(),name='salesreturninvoices'),
    url(r'^purchasesinvoices$',views.PurchaseInvoices.as_view(),name='purchasesinvoices'),
    url(r'^purchasesreturninvoices$',views.PurchaseReturnInvoices.as_view(),name='purchasesreturninvoices'),
]

hpatterns = [
    url(r'^recall/sales$',views.RecallSalesInvoice.as_view()),
    url(r'^recall/purchases$',views.RecallPurchaseInvoice.as_view()),
    url(r'^recall/salesreturns$',views.RecallSalesReturnInvoice.as_view()),
    url(r'^recall/purchasesreturns$',views.RecallPurchaseReturnInvoice.as_view()),
    url(r'^void/purchasesinvoice$',views.VoidPurchaseInvoice.as_view()),
    url(r'^void/purchasesreturninvoice$',views.VoidPurchaseReturnInvoice.as_view()),
    url(r'^void/salesinvoice$',views.VoidSalesInvoice.as_view()),
    url(r'^void/salesreturninvoice$',views.VoidSalesReturnInvoice.as_view()),
    url(r'^pay/salesinvoice$',views.PaySalesInvoice.as_view()),
    url(r'^pay/purchasesinvoice$',views.PayPurchaseInvoice.as_view()),
]

apiv1 = [
    url(r'^update/',include(upatterns)),
    url(r'^helpers/',include(hpatterns)),
    url(r'^create/',include(cpatterns)),
    url(r'^query/',include(qpatterns)),
]

urlpatterns = [
    url(r'^$',views.AppInit.as_view(),name="index"),
    url(r'^apiv1/',include(apiv1)),
]
