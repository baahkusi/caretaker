from django.conf.urls import url,include
from . import views

app_name = "customer"

upatterns = [
    url(r'^customer/(?P<pk>[0-9]+)$',views.UpdateCustomer.as_view(),name='update-customer'),
]

cpatterns = [
    url(r'^customer$',views.CreateCustomer.as_view(),name='create-customer'),
]

qpatterns = [
    url(r'^customers$',views.Customers.as_view(),name='customers'),
]

dpatterns = [
    url(r'^customer/(?P<pk>[0-9]+)$',views.DeleteCustomer.as_view(),name='delete-customer'),
]

hpatterns = [
    url(r'^getcustomeridface$',views.CuteIdFace.as_view(),name="getcustomeridface"),
    url(r'^sales$',views.CuteSI.as_view()),
]

apiv1 = [
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
