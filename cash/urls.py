from django.conf.urls import url,include
from . import views

app_name = "cash"

upatterns = [
    url(r'^cash/(?P<pk>[0-9]+)$',views.UpdateCash.as_view(),name="update-cash"),
]

dpatterns = [
    url(r'^cash/(?P<pk>[0-9]+)$',views.DeleteCash.as_view(),name="delete-cash"),
]

cpatterns = [
    url(r'^cash$',views.CreateCash.as_view(),name="create-cash"),
    url(r'^increment$',views.CreateCashIncrement.as_view(),name="create-increment"),
    url(r'^decrement$',views.CreateCashDecrement.as_view(),name="create-decrement"),
]

qpatterns = [
    url(r'^cashs$',views.Cashs.as_view(),name="cashs"),
    url(r'^increments$',views.CashIncrements.as_view(),name="decrements"),
    url(r'^decrements$',views.CashDecrements.as_view(),name="increments"),
]

hpatterns = [
    url(r'^track$',views.CashTracker.as_view(),name="cashs"),
    url(r'^track/summary$',views.CashSummaryTracker.as_view()),
    url(r'^systems$',views.Systems.as_view()),
]

apiv1 = [
    url(r'^$',views.AppInit.as_view(),name="index"),
    url(r'^update/',include(upatterns)),
    url(r'^delete/',include(dpatterns)),
    url(r'^create/',include(cpatterns)),
    url(r'^query/',include(qpatterns)),
    url(r'^helpers/',include(hpatterns)),
]

urlpatterns = [
    url(r'^$',views.AppInit.as_view(),name="index"),
    url(r'^apiv1/',include(apiv1)),
]
