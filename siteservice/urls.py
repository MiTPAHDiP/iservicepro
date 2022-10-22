from django.urls import path, include

from siteservice.views import index


urlpatterns = [
    path('', index),

]