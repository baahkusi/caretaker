from django.shortcuts import redirect
from django.http import JsonResponse

def access_required(app):
    """This decorator takes a single argument which is the id of the app
    and then checks if the currently logged in user has access to the app else redirect user to a nice page crying access denied/home page.
    """
    def access_decorator(old_func):
        def new_func(request, *args, **kwargs):
            if request.user.is_authenticated: # check if user is not anonymous
                if request.user.is_superuser:
                    return old_func(request, *args, **kwargs)
                else:
                    access_list = request.user.access.access.split(',')
                    if str(app) in access_list:
                        return old_func(request, *args, **kwargs)
                    else:
                        return redirect('access:access-home')
            else:
                return redirect('access:access-login')
        return new_func
    return access_decorator


def api_key_check(api_key):

    def api_decorator(old_func):
        
        def new_func(request):
            key = request.POST['KEY']
            if key == api_key:
                return old_func(request)
            else:
                return JsonResponse({'status':False, 'msg':'Unable to ...'})
        return new_func
    return api_decorator