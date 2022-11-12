from django.contrib import admin

# Register your models here.
from django.contrib.admin.views.main import ChangeList

from siteservice.models import Phone, NewiPhone, MacBook, ModelMacBook, Memory, AllColors, Region


def not_available(modeladmin, request, queryset):
    queryset.update(status='not_available')


not_available.short_description = "Нет в наличии"


def available(modeladmin, request, queryset):
    queryset.update(status='available', )


available.short_description = "В наличии"


def used(modeladmin, request, queryset):
    queryset.update(activ_or_not='used')


used.short_description = "Б/У"


def new(modeladmin, request, queryset):
    queryset.update(activ_or_not='new')


new.short_description = "Новый"


def activ(modeladmin, request, queryset):
    queryset.update(activ_or_not='activ')


activ.short_description = "Активирован"


# Модель моделей айфон
class PhoneAdmin(admin.ModelAdmin):
    # list_display = [field.name for field in Phone._meta.get_fields() if not field.many_to_many]
    list_display = ['name']

    #     'new_or_used', 'created_at', 'status',)

    # list_select_related = (
    #     'model_phone', 'memory_phone', 'colors_phone',
    #     'region_phone', 'price_phone',
    #     'new_or_used', 'created_at', 'status',)

    search_fields = ('name',)
    # # form = ProfileForm
    # list_filter = ('model_phone', 'memory_phone', 'colors_phone',)
    # actions = [not_available, available]


# Модель новых айфон
class iPhoneAdmin(admin.ModelAdmin):
    list_display = ['model_phone',
                    'memory_phone',
                    'colors_phone',
                    'region_phone',
                    'price_phone',
                    'created_at',
                    'status',
                    'activ_or_not']

    search_fields = ['model_phone__name', 'memory_phone__memory', 'colors_phone__colors', 'price_phone']
    actions = [not_available, available, new, used, activ, ]


class MemoryAdmin(admin.ModelAdmin):
    ...


class AllColorAdmin(admin.ModelAdmin):
    ...


class RegionAdmin(admin.ModelAdmin):
    ...


@admin.register(ModelMacBook)
class ModelMacBookAdmin(admin.ModelAdmin):
    list_display = ['macbook_name']
    actions = [not_available, available]

    # 'model', 'diagonal',
    # 'years_macbook', 'chip',
    # 'mac_memory', 'mac_color',
    # 'mac_region', 'created_at', 'availability_mac',)
    # list_select_related = (
    #     'macbook_model', 'diagonal',
    #     'years_macbook', 'chip',
    #     'mac_memory', 'mac_color',
    #     'mac_region', 'availability_mac',)


@admin.register(MacBook)
class MacBookAdmin(admin.ModelAdmin):
    list_display = ['model', 'years', 'mac_color', 'mac_memory', 'ram', 'mac_region', 'price_mac']
    actions = [not_available, available]


admin.site.register(Phone, PhoneAdmin)
admin.site.register(NewiPhone, iPhoneAdmin)
admin.site.register(Memory, MemoryAdmin)
admin.site.register(AllColors, AllColorAdmin)
admin.site.register(Region, RegionAdmin)

'''class categories(admin.ModelAdmin):
    list_display = ('title', 'get_parents', 'when')'''
