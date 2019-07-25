from django.conf.urls import url,include
from . import views

app_name = "inventory"

upatterns = [
    url(r'^category/(?P<pk>[0-9]+)$',views.UpdateCategory.as_view(),name="update-category"),
    url(r'^product/(?P<pk>[0-9]+)$',views.UpdateProduct.as_view(),name="update-product"),
]

dpatterns = [
    url(r'^category/(?P<pk>[0-9]+)$',views.DeleteCategory.as_view(),name="delete-category"),
    url(r'^product/(?P<pk>[0-9]+)$',views.DeleteProduct.as_view(),name="delete-product"),
]

cpatterns = [
    url(r'^category$',views.CreateCategory.as_view(),name="create-category"),
    url(r'^product$',views.CreateProduct.as_view(),name="create-product"),
    url(r'^increment$',views.CreateInventoryIncrement.as_view(),name="create-increment"),
    url(r'^decrement$',views.CreateInventoryDecrement.as_view(),name="create-decrement"),
]

qpatterns = [
    url(r'^categorys$',views.Categorys.as_view(),name="categorys"),
    url(r'^products$',views.Products.as_view(),name="products"),
    url(r'^product/(?P<pk>[0-9]+)$$',views.Productt.as_view(),name="product"),
    url(r'^increments$',views.InventoryIncrements.as_view(),name="increments"),
    url(r'^increments/purchases$',views.InventoryIncrementsPurchase.as_view(),name="pincrements"),
    url(r'^increments/salesreturns$',views.InventoryIncrementsSR.as_view(),name="srincrements"),
    url(r'^increments/others$',views.InventoryIncrementsOT.as_view(),name="otincrements"),
    url(r'^decrements$',views.InventoryDecrements.as_view(),name="decrements"),
    url(r'^decrements/sales$',views.InventoryDecrementsSale.as_view(),name="sdecrements"),
    url(r'^decrements/purchasereturns$',views.InventoryDecrementsPR.as_view(),name="prdecrements"),
    url(r'^decrements/others$',views.InventoryDecrementsOT.as_view(),name="otdecrements"),
]

hpatterns = [
    url(r'^getcategoryidface$',views.CatIdFace.as_view()),
    url(r'^getproductidface$',views.ProdIdFace.as_view()),
    url(r'^track$',views.InventoryTracker.as_view()),
    url(r'^track/summary$',views.InventorySummaryTracker.as_view()),
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
