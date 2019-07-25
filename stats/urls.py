from django.conf.urls import url,include
from . import views

app_name = "stats"

daily = [
    url(r'^cash/sales',views.DailyCashS.as_view()),
    url(r'^cash/pc',views.DailyCashPc.as_view()),
    url(r'^cash/sr',views.DailyCashSr.as_view()),
    url(r'^cash/pr',views.DailyCashPr.as_view()),
    url(r'^credit/sales',views.DailyCreditS.as_view()),
    url(r'^credit/pc',views.DailyCreditPc.as_view()),
    url(r'^credit/sr',views.DailyCreditSr.as_view()),
    url(r'^credit/pr',views.DailyCreditPr.as_view()),
]

weekly = [
    url(r'^cash/sales',views.WeeklyCashS.as_view()),
    url(r'^cash/pc',views.WeeklyCashPc.as_view()),
    url(r'^cash/sr',views.WeeklyCashSr.as_view()),
    url(r'^cash/pr',views.WeeklyCashPr.as_view()),
    url(r'^credit/sales',views.WeeklyCreditS.as_view()),
    url(r'^credit/pc',views.WeeklyCreditPc.as_view()),
    url(r'^credit/sr',views.WeeklyCreditSr.as_view()),
    url(r'^credit/pr',views.WeeklyCreditPr.as_view()),
]

monthly = [
    url(r'^cash/sales',views.MonthlyCashS.as_view()),
    url(r'^cash/pc',views.MonthlyCashPc.as_view()),
    url(r'^cash/sr',views.MonthlyCashSr.as_view()),
    url(r'^cash/pr',views.MonthlyCashPr.as_view()),
    url(r'^credit/sales',views.MonthlyCreditS.as_view()),
    url(r'^credit/pc',views.MonthlyCreditPc.as_view()),
    url(r'^credit/sr',views.MonthlyCreditSr.as_view()),
    url(r'^credit/pr',views.MonthlyCreditPr.as_view()),
]

yearly = [
    url(r'^cash/sales',views.YearlyCashS.as_view()),
    url(r'^cash/pc',views.YearlyCashPc.as_view()),
    url(r'^cash/sr',views.YearlyCashSr.as_view()),
    url(r'^cash/pr',views.YearlyCashPr.as_view()),
    url(r'^credit/sales',views.YearlyCreditS.as_view()),
    url(r'^credit/pc',views.YearlyCreditPc.as_view()),
    url(r'^credit/sr',views.YearlyCreditSr.as_view()),
    url(r'^credit/pr',views.YearlyCreditPr.as_view()),
]

ppatterns = [
    url(r'^daily/',include(daily)),
    url(r'^weekly/',include(weekly)),
    url(r'^monthly/',include(monthly)),
    url(r'^yearly/',include(yearly)),
]

product = [
    url(r'^cash/sales',views.ProdCashS.as_view()),
    url(r'^cash/pc',views.ProdCashPc.as_view()),
    url(r'^cash/sr',views.ProdCashSr.as_view()),
    url(r'^cash/pr',views.ProdCashPr.as_view()),
    url(r'^credit/sales',views.ProdCreditS.as_view()),
    url(r'^credit/pc',views.ProdCreditPc.as_view()),
    url(r'^credit/sr',views.ProdCreditSr.as_view()),
    url(r'^credit/pr',views.ProdCreditPr.as_view()),
]

user = [
    url(r'^cash/sales',views.UserCashS.as_view()),
    url(r'^cash/pc',views.UserCashPc.as_view()),
    url(r'^cash/sr',views.UserCashSr.as_view()),
    url(r'^cash/pr',views.UserCashPr.as_view()),
    url(r'^credit/sales',views.UserCreditS.as_view()),
    url(r'^credit/pc',views.UserCreditPc.as_view()),
    url(r'^credit/sr',views.UserCreditSr.as_view()),
    url(r'^credit/pr',views.UserCreditPr.as_view()),
]

payment = [
    url(r'^cash/sales',views.PayCashS.as_view()),
    url(r'^cash/pc',views.PayCashPc.as_view()),
    url(r'^cash/sr',views.PayCashSr.as_view()),
    url(r'^cash/pr',views.PayCashPr.as_view()),
]

cpatterns = [
    url(r'^product/',include(product)),
    url(r'^user/',include(user)),
    url(r'^pay/',include(payment)),
]

epatterns = [
    url(r'^cash/sales',views.ExportCashS.as_view()),
#     url(r'^cash/pc',views.ExportCashPc.as_view()),
#     url(r'^cash/sr',views.ExportCashSr.as_view()),
#     url(r'^cash/pr',views.ExportCashPr.as_view()),
#     url(r'^credit/sales',views.ExportCreditS.as_view()),
#     url(r'^credit/pc',views.ExportCreditPc.as_view()),
#     url(r'^credit/sr',views.ExportCreditSr.as_view()),
#     url(r'^credit/pr',views.ExportCreditPr.as_view()),
]

spatterns = [
    url(r'^periodic/',include(ppatterns)),
    url(r'^categoric/',include(cpatterns)),
    url(r'^export/',include(epatterns)),
]

apiv1 = [
    url(r'^stat/',include(spatterns)),
]

urlpatterns = [
    url(r'^sales$',views.AppInitS.as_view()),
    url(r'^purchases$',views.AppInitP.as_view()),
    url(r'^apiv1/',include(apiv1)),
]
