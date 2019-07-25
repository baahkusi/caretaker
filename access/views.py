from django.views import View
from django.views.generic.base import TemplateView
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from access.forms import UserForm
from custom.views import JSONCreateView,JSONUpdateView,JSONDeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from access.helpers import date_time_split
from access.models import Access
from django.utils.decorators import method_decorator
from custom.decorators import access_required
from access import access
from django.shortcuts import render
from osm.models import Bussiness,BussinessBranch


def not_available(request):
    if request.method == 'POST':
        return JsonResponse({'status':False, 'msg':'404 Resource Not Available'})
    
    if request.method == 'GET':
        return render(request, template_name='access/404.html')


class AllApps(TemplateView):
    def get(self, request, *args, **kwargs):
        apps = []
        APPS = access.APPS.copy()
        for APP in APPS:
            if 'data' in APP.keys():
                val = APP['value']
                for app in APP['data']:
                    ue = app['value']
                    appname = app['app']
                    apps.append({
                        'id':appname,
                        'value':val+" "+ue,
                    })
            else:
                value = APP['value']
                appname = APP['app']
                apps.append({
                    'id':appname,
                    'value':value,
                })

        return JsonResponse(apps,safe=False)

class AppInit(TemplateView):
    login_url = '/'
    template_name = "access/login.html"

class AccessHome(LoginRequiredMixin,TemplateView):
    template_name = "access/index.html"

@method_decorator(access_required('user'), name='dispatch')
class AccessUser(LoginRequiredMixin,TemplateView):
    template_name = "access/user.html"

class AccessList(View):

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated: # check if user is not anonymous
            if request.user.is_superuser:
                APPS = access.APPS.copy()
            else:
                access_list = request.user.access.access.split(',')
                AP = access.APPS.copy()
                APPS = []
                for APP in AP:
                    if 'data' in APP.keys():
                        app = {
                            "id": APP['id'],
                            "icon": APP['icon'],
                            "value": APP['value'],
                            "app": APP['app'],
                            "data":[]
                        }
                        for appdat in APP['data']:
                            if appdat['app'] in access_list:
                                app['data'].append(appdat)
                        if len(app['data']) > 0:
                            APPS.append(app)
                    else:
                        if APP['app'] in access_list:
                            APPS.append(APP)
        else:
            APPS = []
        return JsonResponse(APPS,safe=False)

class CreateUser(View):
    def post(self, request, *args, **kwargs):
        username = request.POST['username']
        password = request.POST['password']
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        if bussiness is None and branch is None:
            pass
        else:
            try:
                bussiness = Bussiness.objects.get(pk=bussiness)
                branch = BussinessBranch.objects.get(pk=branch)
            except Exception as e:
                # print(e)
                return JsonResponse({'status':False, 'msg': 'Bussiness / Branch Failure'})
        try:
            user = User.objects.create_user(username=username,password=password)
            Access.objects.create(user=user, bussiness=bussiness, branch=branch)
            data = {'status':True,'id':user.id}
        except Exception as e:
            # print(e)
            data = {'status':False, 'msg':'Something went wrong'}
        return JsonResponse(data)

class UpdateUser(JSONUpdateView):
    model = User
    form = UserForm
    key = 'id'
    from_post = True

class DeleteUser(JSONDeleteView):
    model = User

    def make_query(self, ask):
        return self.model.objects.get(pk=ask['pk'], access__bussiness=ask['bussiness'], access__branch=ask['branch'])

class AlterAccess(View):
    def post(self, request, *args, **kwargs):
        if request.POST:
            perms = request.POST['access']
            pk = request.POST['id']
            user = User.objects.get(pk=pk)
            if hasattr(user,'access'):
                access = Access.objects.get(user=user)
                access.access = perms
            else:
                access = Access.objects.create(user=user)
                user.access.access = perms
            access.save()
            return JsonResponse({'status':True})

class QueryUsers(View):
    def get(self, request, *args, **kwargs):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        users = User.objects.filter(access__bussiness=bussiness, access__branch=branch)
        data = []
        for user in users:
            data.append({
                'id':user.id,
                'username':user.username,
                'first_name':user.first_name,
                'last_name':user.last_name,
                'email':user.email,
                'last_login':date_time_split(user.last_login)[0],
                'last_login_time':date_time_split(user.last_login)[1],
                'register_date':date_time_split(user.date_joined)[0],
                'register_time':date_time_split(user.date_joined)[1],
                'access':user.access.access,
            })
        return JsonResponse(data,safe=False)

class LoginUserView(View):
    def post(self, request, *args, **kwargs):
        if request.POST:
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username,password=password)
            if user is not None:

                bussiness = request.session['BB']['BUSSINESS']
                branch = request.session['BB']['BRANCH']
                user_bussiness = user.access.bussiness.id if user.access.bussiness else None
                user_branch = user.access.branch.id if user.access.branch else None
                if user_bussiness == bussiness and user_branch == branch:
                    login(request,user)
                    data = {'status':True}
                else:
                    data = {'status':False, 'msg':'not in bussiness'}
                
            else:
                data = {'status':False, 'msg':'in bussiness'}
            return JsonResponse(data)

class LoggedInUserInfo(View):
    def get(self, request, *args, **kwargs):
        user = {
            'username':request.user.username,
            'first name':request.user.first_name,
            'last name':request.user.last_name,
            'email':request.user.email
        }
        return JsonResponse(user)

class LogoutUserView(View):
    def post(self, request, *args, **kwargs):
        logout(request)
        return JsonResponse({'status':True})

class UserIdFace(View):
    def get(self, request, *args, **kwargs):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        users = User.objects.filter(access__bussiness=bussiness, access__branch=branch)
        data = []
        for user in users:
            data.append({
                'id':user.id,
                'value':user.username,
            })
        return JsonResponse(data,safe=False)
