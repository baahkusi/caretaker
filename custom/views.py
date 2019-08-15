from django.views import View
from django.http import JsonResponse
from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
import json

class JSONCreateView(View):

    defaults ={} # {"submitted from form":" equivalent in database"}
    object_dat = ['id']
    user_required = False

    def get(self, request, *args, **kwargs):
        data = {'status':False,'msg':'Can\'t create with get request'}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        if request.POST: # if form data is not empty
            data = self.settle_defaults(request,request.POST)
            form = self.get_form(data)
            if form.is_valid(): # validate and clean form
                instance = form.save() # save the data
                object_id = instance.id
                self.after_create(instance,data)
                object_dat = self.get_object_dat(instance)
                data = {'status':True,'msg':'New item successfully created','object':object_dat}
            else:
                data = {}
                data['errors'] = form.errors.as_json()
                data['status'] = False
                data['msg'] = 'Invalid data'
        else:
            data = {'status':False,'msg':'Empty request'}
        return JsonResponse(data) # return response in json format

    def get_form(self,data):
        return self.form(data)

    def settle_defaults(self,request,requestPost):
        data = {}
        for form_key in requestPost.keys():
            if form_key in self.defaults.keys():
                db_key = self.defaults[form_key]
                data[db_key] = requestPost[form_key]
            else:
                data[form_key] = requestPost[form_key]
        if self.user_required:
            data['employee'] = request.user.id
        return data

    def after_create(self,*args):
        pass

    def get_object_dat(self,model):
        model_dict = model_to_dict(model)
        object_dat = {}
        for dat in self.object_dat:
            if dat in model_dict.keys():
                object_dat[dat] = model_dict[dat]
            else:
                object_dat[dat] = getattr(model,dat)
        return object_dat

class JSONQueryView(View):

    accept_arg = False
    export_data = False

    def get(self, request, *args, **kwargs):
        return self.proc_f(request, request.GET, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.proc_f(request, request.POST, *args, **kwargs)
    
    def proc_f(self, request, method, *args, **kwargs):
        ask = {}
        if self.accept_arg:
            if method:
                for key, value in method.items():
                    ask[key] = value
        data = self.make_query(ask)
        if self.export_data:
            export_format = 'pdf' #ask['format']
            headers = 'sevs' #ask['headers']
            return self.export(data,headers,export_format)
        else:
            return JsonResponse(data,safe=False)

    def make_query(self,ask=None):
        return list(self.model.objects.filter(**ask).values())

    def export(self,data,headers,export_format):
        if export_format == 'pdf':
            fname = headers+'.pdf'
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename={}'.format(fname)
        else:
            pass
        response.write(self.make_export(data,headers))
        return response

    def make_export(self,data,headers):
        pass

class JSONUpdateView(View):

    defaults = []
    from_post = False
    key = 'pk'
    user_required = False

    def get(self, request, *args, **kwargs):
        data = {'status':False,'msg':'Can\'t update with get request'}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        if request.POST:
            # try:
            if self.from_post:
                model = self.make_query(ask=request.POST[self.key])
            else:
                model = self.make_query(ask=self.kwargs[self.key])
            fdata=self.settle_defaults(request,request.POST,model)
            form = self.get_form(fdata, instance=model)
            if form.is_valid:
                form.save() # save the data
                data = {'status':True,'msg':'Item successfully updated'}
            else:
                data = {}
                data['errors'] = form.errors.as_json()
                data['status'] = False
                data['msg'] = 'Invalid data'
            # except:
                # data = {'status':False,'msg':'Item does not exist'}
        else:
            data = {'status':False,'msg':'Empty request'}
        return JsonResponse(data) # return response in json format

    def get_form(self, data, instance):
        return self.form(data, instance=instance)

    def make_query(self, ask):
        return self.model.objects.get(pk=ask)

    def settle_defaults(self,request,requestPost,model):
        model_dict = model_to_dict(model)
        data = {}
        for key in requestPost.keys():
            if key in self.defaults:
                data[key] = model_dict[key]
            else:
                data[key] = requestPost[key]
        if self.user_required:
            data['employee'] = request.user.id
        return data

class JSONDeleteView(View):

    def get(self, request, *args, **kwargs):
        data = {'status':False,'msg':'Can\'t delete with get request'}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            pk = self.kwargs['pk']
            ask = {
                'pk': pk,
            }
            self.make_query(ask).delete()
            data = {'status':True,'msg':'Item successfully deleted'}
        except:
            data = {'status':False,'msg':'Item does not exist'}
        return JsonResponse(data)

    def make_query(self, ask):
        return self.model.objects.get(**ask)

class JSONCreateMultipleView(View):

    expected_var ="" # the variable of requestPost that holds the data
    general_vars = [] # other variables of requestPost that are general
    user_required = False

    def get(self, request, *args, **kwargs):
        data = {'status':False,'msg':'Unauthorized Request'}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        if request.POST: # if form data is not empty
            status = self.process_multiple(request,request.POST)
            af_status = self.print_receipt(request.POST)
            data = {'status':status[0],'msg':status[1],'errors':status[2]}
        else:
            data = {'status':False,'msg':'Empty request'}
        return JsonResponse(data) # return response in json format

    def get_form(self,data):
        return self.form(data)

    def process_multiple(self,request,requestPost):
        check = 0
        expected_var = json.loads(requestPost[self.expected_var])
        errors = []
        for data in expected_var:

            for var in self.general_vars:
                data[var] = requestPost.get(var)
            if self.user_required:
                data['employee'] = request.user.id
            form = self.get_form(data)
            if form.is_valid(): # validate and clean form
                form.save() # save the data
            else:
                errors.append(form.errors.as_json())
                check += 1
        if check == 0:
            return (True,"All Objects Successfully Saved",errors)
        else:
            return (False,"Some Objects Were Not Saved",errors)

    def print_receipt(self,requestPost):
        data = {}
        data['items'] = json.loads(requestPost[self.expected_var])
        if hasattr(self,'numbers'):
            for number in self.numbers:
                if number in requestPost.keys():
                    data[number] = requestPost[number]
                else:
                    data[number] = ''
        return data

class JSONQueryGet(View):
    """For all scenarios where one has to check the existence of an
        object in one model (Qmodel) and then based on whether that object exists, use it to load in objects of another model(Rmodel) to which it is a foreign key.It should allow both get and post requests and the only parameter it expects is a unique attribute of the Qmodel."""

    extra_values = {} # {existing:extra}

    def get(self, request, *args, **kwargs):
        attr = attr = {
            'attr': request.GET[self.attr],
        }
        data = self.prepare_data(self.query_get(attr))
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        attr = {
            'attr': request.POST[self.attr],
        }
        data = self.prepare_data(self.query_get(attr))
        return JsonResponse(data)

    def query_get(self, attr):
        try:
            q_dict = {
                self.attr:attr['attr'], 
            }
            q_model = self.Qmodel.objects.get(**q_dict)
            q_object = list(self.Qmodel.objects.filter(**q_dict).values())[0]
            self.proc_f(self,q_object)
            r_dict = {self.fk:q_model}
            r_models = list(self.Rmodel.objects.filter(**r_dict).values())
            msg = {'status':True,'r_objects':r_models,'q_objects':q_object}
        except ObjectDoesNotExist:
            msg = {'status':False,'msg':'Invalid Information'}
        return msg

    def prepare_data(self,data):
        if data['status']:
            for key,item in self.extra_values.items():
                for dat in data['r_objects']:
                    dat[item] = dat[key]
        return data

    def proc_f(self,**kwargs):
        pass
