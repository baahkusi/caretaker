from django.conf.urls import url,include
from . import views

app_name = "tax"

upatterns = [
    url(r'^tax/(?P<pk>[0-9]+)$',views.UpdateTax.as_view(),name='update-tax'),
]

cpatterns = [
    url(r'^tax$',views.CreateTax.as_view(),name='create-tax'),
]

qpatterns = [
    url(r'^taxs$',views.Taxs.as_view(),name='taxs'),
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
