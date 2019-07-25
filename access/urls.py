from django.conf.urls import url,include
from access import views
app_name = 'access'
urlpatterns = [
    url(r'^$',views.AccessList.as_view()),
    url(r'^login$',views.LoginUserView.as_view(),name='access-login'),
    url(r'^logout$',views.LogoutUserView.as_view()),
    url(r'^home$',views.AccessHome.as_view(),name='access-home'),
    url(r'^userdata$',views.LoggedInUserInfo.as_view()),
    url(r'^user$',views.AccessUser.as_view()),
    url(r'^user/update$',views.UpdateUser.as_view()),
    url(r'^user/create$',views.CreateUser.as_view()),
    url(r'^user/delete/(?P<pk>[0-9]+)$',views.DeleteUser.as_view()),
    url(r'^user/query$',views.QueryUsers.as_view()),
    url(r'^user/access$',views.AlterAccess.as_view()),
    url(r'^user/id$',views.UserIdFace.as_view()),
    url(r'^apps$',views.AllApps.as_view()),
    url(r'^404$', views.not_available, name='404'),
]
