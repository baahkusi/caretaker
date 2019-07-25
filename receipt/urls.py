from django.conf.urls import url,include
from . import views

app_name = "receipt"

upatterns = [
    url(r'^salesreceipt/(?P<pk>[0-9]+)$',views.UpdateSalesReceipt.as_view(),name='update-salesreceipt'),
    url(r'^salesreturnreceipt/(?P<pk>[0-9]+)$',views.UpdateSalesReturnReceipt.as_view(),name='update-salesreturnreceipt'),
    url(r'^purchasesreceipt/(?P<pk>[0-9]+)$',views.UpdatePurchaseReceipt.as_view(),name='update-purchasesreceipt'),
    url(r'^purchasesreturnreceipt/(?P<pk>[0-9]+)$',views.UpdatePurchaseReturnReceipt.as_view(),name='update-purchasesreturnreceipt'),
]

cpatterns = [
    url(r'^salesreceipt$',views.CreateSalesReceipt.as_view(),name='create-salesreceipt'),
    url(r'^salesreturnreceipt$',views.CreateSalesReturnReceipt.as_view(),name='create-salesreturnreceipt'),
    url(r'^purchasesreceipt$',views.CreatePurchaseReceipt.as_view(),name='create-purchasesreceipt'),
    url(r'^purchasesreturnreceipt$',views.CreatePurchaseReturnReceipt.as_view(),name='create-purchasesreturnreceipt'),
]

qpatterns = [
    url(r'^salesreceipts$',views.SalesReceipts.as_view(),name='salesreceipts'),
    url(r'^salesreturnreceipts$',views.SalesReturnReceipts.as_view(),name='salesreturnreceipts'),
    url(r'^purchasesreceipts$',views.PurchaseReceipts.as_view(),name='purchasesreceipts'),
    url(r'^purchasesreturnreceipts$',views.PurchaseReturnReceipts.as_view(),name='purchasesreturnreceipts'),
]

hpatterns = [
    url(r'^recall/sales$',views.RecallSalesReceipt.as_view()),
    url(r'^recall/purchases$',views.RecallPurchaseReceipt.as_view()),
    url(r'^recall/salesreturns$',views.RecallSalesReturnReceipt.as_view()),
    url(r'^recall/purchasesreturns$',views.RecallPurchaseReturnReceipt.as_view()),
    url(r'^void/purchasesreceipt$',views.VoidPurchaseReceipt.as_view()),
    url(r'^void/purchasesreturnreceipt$',views.VoidPurchaseReturnReceipt.as_view()),
    url(r'^void/salesreceipt$',views.VoidSalesReceipt.as_view()),
    url(r'^void/salesreturnreceipt$',views.VoidSalesReturnReceipt.as_view()),
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
