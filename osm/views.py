from django.shortcuts import render
from .models import Bussiness, BussinessBranch
from django.views.decorators.http import require_POST
from custom.decorators import api_key_check
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from access.models import Access
import json
# Create your views here.

ESTABLISH_BUSSINESS_KEY = '123'
ESTABLISH_BRANCH_KEY = '456'
EXTEND_SUBSCRIPTION = '789'
UPDATE_BRANCH = 'ABC'
UPDATE_BUSSINESS = 'DEF'

@require_POST
@api_key_check(ESTABLISH_BUSSINESS_KEY)
def establish_bussiness(request):

    try:
        subdomain_hash = request.POST['subdomain_hash']
        bussiness = Bussiness.objects.get(subdomain_hash=subdomain_hash)
        return JsonResponse({'status':False, 'msg':'Bussiness already exists'})
    except ObjectDoesNotExist:
        pass

    try:
        Bussiness.objects.create(
            name = request.POST.get('name'),
            domain = request.POST.get('domain'),
            subdomain = request.POST.get('subdomain'),
            subdomain_hash = request.POST.get('subdomain_hash'),
            email = request.POST.get('email'),
        )
        return JsonResponse({'status':True, 'msg':'Bussiness Establishment Success'})
    except Exception:
        return JsonResponse({'status':False, 'msg':'Bussiness Establishment Failed'})


@require_POST
@api_key_check(ESTABLISH_BRANCH_KEY)
def establish_branch(request):
    
    try:
        branch = BussinessBranch.objects.get(branch_hash=request.POST['branch_hash'])
        return JsonResponse({'status':False, 'msg':'Branch already exists'})
    except ObjectDoesNotExist:
        pass

    try:
        bussiness = Bussiness.objects.get(subdomain_hash=request.POST['subdomain_hash'])
    except ObjectDoesNotExist:
        return JsonResponse({'status':False, 'msg':'Branch Bussiness does not exist'})

    try:
        branch = BussinessBranch.objects.create(
            bussiness = bussiness,
            name = request.POST.get('name'),
            location = request.POST.get('location'),
            status = request.POST.get('status'),
            branch_hash = request.POST.get('branch_hash'),
            renewed_on = request.POST.get('renewed_on'),
            expires_on = request.POST.get('expires_on'),
        )
    except Exception as e:
        # print(e)
        return JsonResponse({'status':False, 'msg':'Branch Establishment Failed'})

    username = request.POST['username']+'@'+bussiness.id+'-'+branch.id
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        try:
            user = User.objects.create_user(username=username,password=password)
            Access.objects.create(user=user, bussiness=bussiness, branch=branch)
        except Exception as e:
            # print(e)
            return JsonResponse({'status':False, 'msg':'Something went wrong'})

    return JsonResponse({'status':True, 'msg':'Branch Establishment Success'})

@require_POST
@api_key_check(EXTEND_SUBSCRIPTION)
def extend_subscription(request):
    try:
        bussiness = Bussiness.objects.get(subdomain_hash=request.POST.get('subdomain_hash'))
    except ObjectDoesNotExist:
        return JsonResponse({'status':False, 'msg':'Bussiness does not exist'})

    try:
        branch = BussinessBranch.objects.get(branch_hash=request.POST.get('branch_hash'))
        branch.renewed_on = request.POST.get('renewed_on')
        branch.expires_on = request.POST.get('expires_on')
        branch.save()
        return JsonResponse({'status':True, 'msg':'Subscription Extended'})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False, 'msg':'Branch does not exist'})


@require_POST
@api_key_check(UPDATE_BUSSINESS)
def update_bussiness(request):
    try:
        bussiness = Bussiness.objects.get(subdomain_hash=request.POST.get('subdomain_hash'))
        for update in request.POST.items():
            if hasattr(bussiness, update[0]):
                setattr(bussiness, update[0], update[1])
        bussiness.save()
        return JsonResponse({'status':True, 'msg':'Bussiness Update Success'})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False, 'msg':'Bussiness Update Failed'})

@require_POST
@api_key_check(UPDATE_BRANCH)
def update_branch(request):
    try:
        branch = BussinessBranch.objects.get(branch_hash=request.POST.get('branch_hash'))
        for update in request.POST.items():
            if hasattr(branch, update[0]):
                setattr(branch, update[0], update[1])
        branch.save()
        return JsonResponse({'status':True, 'msg':'Branch Update Success'})
    except ObjectDoesNotExist:
        return JsonResponse({'status':False, 'msg':'Branch Update Failed'})
