from django.contrib import admin

# Register your models here.
from django.contrib.admin.views.main import ChangeList

from siteservice.models import Memory, \
    AllColors, Phone, NewiPhone, MacBook, \
    Imac, OperatingSystem, Region, NewMacBook, UsedIPhones


def not_available(modeladmin, request, queryset):
    queryset.update(status='n')


not_available.short_description = "Нет в наличии"


def available(modeladmin, request, queryset):
    queryset.update(status='y', )


available.short_description = "В наличии"


# Модель моделей айфон
class PhoneAdmin(admin.ModelAdmin):
    # list_display = [field.name for field in Phone._meta.get_fields() if not field.many_to_many]
    list_display = ['phone_name']

    #     'new_or_used', 'created_at', 'status',)

    # list_select_related = (
    #     'model_phone', 'memory_phone', 'colors_phone',
    #     'region_phone', 'price_phone',
    #     'new_or_used', 'created_at', 'status',)

    search_fields = ('phone_name',)
    # # form = ProfileForm
    # list_filter = ('model_phone', 'memory_phone', 'colors_phone',)
    # actions = [not_available, available]


# Модель новых айфон
class iPhoneAdmin(admin.ModelAdmin):
    list_display = ['model_phone',
                    'get_memory',
                    'get_colors',
                    'get_region',
                    'price_phone',
                    'created_at',
                    'status',
                    'new_or_used']

    search_fields = ['model_phone']


class NewMacBookAdmin(admin.ModelAdmin):
    ...
    # list_display = (
    #     'macbook_model', 'diagonal',
    #     'years_macbook', 'chip',
    #     'mac_memory', 'mac_color',
    #     'mac_region', 'created_at', 'availability_mac',)
    # list_select_related = (
    #     'macbook_model', 'diagonal',
    #     'years_macbook', 'chip',
    #     'mac_memory', 'mac_color',
    #     'mac_region', 'availability_mac',)


#
@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    pass


#
@admin.register(AllColors)
class AllColorsAdmin(admin.ModelAdmin):
    pass


@admin.register(UsedIPhones)
class UsedAdmin(admin.ModelAdmin):
    pass


@admin.register(Imac)
class iMacAdmin(admin.ModelAdmin):
    pass


@admin.register(OperatingSystem)
class OperatingSystemAdmin(admin.ModelAdmin):
    pass


@admin.register(MacBook)
class MacBookAdmin(admin.ModelAdmin):
    pass


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    pass


admin.site.register(Phone, PhoneAdmin)
admin.site.register(NewiPhone, iPhoneAdmin)
admin.site.register(NewMacBook, NewMacBookAdmin)

'''class categories(admin.ModelAdmin):
    list_display = ('title', 'get_parents', 'when')'''
