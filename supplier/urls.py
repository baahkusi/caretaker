from django.conf.urls import url,include
from . import views

app_name = "supplier"

upatterns = [
    url(r'^supplier/(?P<pk>[0-9]+)$',views.UpdateSupplier.as_view(),name='update-supplier'),
]

cpatterns = [
    url(r'^supplier$',views.CreateSupplier.as_view(),name='create-supplier'),
]

qpatterns = [
    url(r'^suppliers$',views.Suppliers.as_view(),name='suppliers'),
]

hpatterns = [
    url(r'^getsupplieridface$',views.SupIdFace.as_view(),name="suppliersidface"),
    url(r'^purchases$',views.SupPI.as_view()),
]

dpatterns = [
    url(r'^supplier/(?P<pk>[0-9]+)$',views.DeleteSupplier.as_view(),name='delete-supplier'),
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
