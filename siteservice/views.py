from django.http import HttpResponse, request
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PhoneSerializer
from .models import Phone


# from .models import NewiPhone

# Create your views here.


class PhoneSetView(viewsets.ModelViewSet):
    queryset = Phone.objects.all().order_by('name')
    serializer_class = PhoneSerializer


def index(request):
    # iphone = NewiPhone.objects.all()[:20]
    return render(request, 'index.html')


def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponseNotFound
# from .models import NewiPhone
#
#
# # получение данных из бд
# def index(request):
#     people = Person.objects.all()
#     return render(request, "index.html", {"people": people})
#
#
# # сохранение данных в бд
# def create(request):
#     if request.method == "POST":
#         person = Person()
#         person.name = request.POST.get("name")
#         person.age = request.POST.get("age")
#         person.save()
#     return HttpResponseRedirect("/")
#
#
# # изменение данных в бд
# def edit(request, id):
#     try:
#         person = Person.objects.get(id=id)
#
#         if request.method == "POST":
#             person.name = request.POST.get("name")
#             person.age = request.POST.get("age")
#             person.save()
#             return HttpResponseRedirect("/")
#         else:
#             return render(request, "edit.html", {"person": person})
#     except Person.DoesNotExist:
#         return HttpResponseNotFound("<h2>Person not found</h2>")
#
#
# # удаление данных из бд
# def delete(request, id):
#     try:
#         person = Person.objects.get(id=id)
#         person.delete()
#         return HttpResponseRedirect("/")
#     except Person.DoesNotExist:
#         return HttpResponseNotFound("<h2>Person not found</h2>")
