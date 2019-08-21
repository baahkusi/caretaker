"""caretaker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
# from django.contrib import admin
from access.views import AppInit

urlpatterns = [
    url(r'^$',AppInit.as_view(), name='caretaker'),
    url(r'^', include('access.urls')),
    url(r'^inventory/',include('inventory.urls')),
    url(r'^pos/',include('pos.urls')),
    url(r'^pop/',include('pop.urls')),
    url(r'^cash/',include('cash.urls')),
    url(r'^receipt/',include('receipt.urls')),
    url(r'^invoice/',include('invoice.urls')),
    url(r'^supplier/',include('supplier.urls')),
    url(r'^customer/',include('customer.urls')),
    url(r'^access/',include('access.urls')),
    url(r'^stats/',include('stats.urls')),
    url(r'^logger/',include('logger.urls')),
]
