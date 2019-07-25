from django.conf.urls import url, include
from . import views

apiv1patterns = [
    url('establish/bussiness$', views.establish_bussiness),
    url('establish/branch$', views.establish_branch),
    url('update/branch$', views.update_branch),
    url('update/bussiness$', views.update_bussiness),
    url('extend/subscription$', views.extend_subscription),
]

urlpatterns = [
    url('apiv1/', include(apiv1patterns)),
]