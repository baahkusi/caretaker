from django.shortcuts import redirect
from osm.models import Bussiness, BussinessBranch
from django.core.exceptions import ObjectDoesNotExist


class BussinessBranchMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        print(request.POST)
        if 'BB' in request.session.keys():
            pass
        else:
            if request.GET.get('cmp') and request.GET.get('bch'):
                try:
                    comp = request.GET.get('cmp')
                    bussiness = Bussiness.objects.get(subdomain_hash=comp)
                except ObjectDoesNotExist:
                    if request.path == '/':
                        pass
                    elif request.path == '/404':
                        pass
                    else:
                        return redirect('access:404')
                
                try:
                    bch = request.GET.get('bch')
                    branch = BussinessBranch.objects.get(branch_hash=bch)
                except ObjectDoesNotExist:
                    if request.path == '/':
                        pass
                    elif request.path == '/404':
                        pass
                    else:
                        return redirect('access:404')

                request.session['BB'] = {}
                request.session['BB']['BUSSINESS'] = bussiness.id
                request.session['BB']['BRANCH'] = branch.id
            else:
                # api_status = request.POST.get('api')
                # if api_status:
                #     request.session['BB'] = {}
                #     request.session['BB']['BUSSINESS'] = None
                #     request.session['BB']['BRANCH'] = None
                # else:
                #     if request.path == '/':
                #         pass
                #     elif request.path == '/404':
                #         pass
                #     else:
                #         return redirect('access:404')
                request.session['BB'] = {}
                request.session['BB']['BUSSINESS'] = None
                request.session['BB']['BRANCH'] = None
                

        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.

        return response