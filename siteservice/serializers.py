from rest_framework import serializers

from .models import Phone


class PhoneSerializer(serializers.SerializerMetaclass):
    class Meta:
        model = Phone
        fields = ('name')
