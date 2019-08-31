from django.conf.urls import url,include
from . import views

app_name = "accounting"

apiv1 = [
    # url(r'^helpers/',include(hpatterns)),
]

urlpatterns = [
    url(r'^income$',views.AppIncome.as_view()),
    url(r'^expenses$',views.AppExpenses.as_view()),
    url(r'^apiv1/',include(apiv1)),
]
