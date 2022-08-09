from django.http import HttpResponse
from django.shortcuts import render
from .models import iPhone

# Create your views here.


def index(request):
    iphone = iPhone.objects.all()
    return render(request, 'general/index.html', {'iphone' : iphone})
    #return render(request, 'news/index.html', {'news': news, 'title': 'Список новостей'})


