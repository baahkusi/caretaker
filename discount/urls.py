from django.conf.urls import url,include
from . import views

app_name = "discount"

upatterns = [
    url(r'^discount/(?P<pk>[0-9]+)$',views.UpdateDiscount.as_view(),name='update-discount'),
]

cpatterns = [
    url(r'^discount$',views.CreateDiscount.as_view(),name='create-discount'),
]

qpatterns = [
    url(r'^discounts$',views.Discounts.as_view(),name='discounts'),
]


apiv1 = [
    url(r'^update/',include(upatterns)),
    # url(r'^delete/',include(dpatterns)),
    url(r'^create/',include(cpatterns)),
    url(r'^query/',include(qpatterns)),
]

urlpatterns = [
    url(r'^$',views.AppInit.as_view(),name="index"),
    url(r'^apiv1/',include(apiv1)),
]
