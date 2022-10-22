from django.http import HttpResponse, request
from django.shortcuts import render
#from .models import NewiPhone

# Create your views here.


def index(request):
    #iphone = NewiPhone.objects.all()[:20]
    return render(request, 'index.html')


def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False



