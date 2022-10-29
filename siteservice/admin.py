from django.contrib import admin

# Register your models here.
from django.contrib.admin.views.main import ChangeList

from siteservice.models import Phone, NewiPhone, MacBook, ModelMacBook, Memory, AllColors, Region


def not_available(modeladmin, request, queryset):
    queryset.update(status='n')


not_available.short_description = "Нет в наличии"


def available(modeladmin, request, queryset):
    queryset.update(status='y', )


available.short_description = "В наличии"


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
                    'new_or_used']

    search_fields = ['model_phone__name']
    actions = [not_available, available]


class MemoryAdmin(admin.ModelAdmin):
    ...


class AllColorAdmin(admin.ModelAdmin):
    ...


class RegionAdmin(admin.ModelAdmin):
    ...


@admin.register(MacBook)
class RegionAdmin(admin.ModelAdmin):
    ...


@admin.register(ModelMacBook)
class AllModelMacBookAdmin(admin.ModelAdmin):
    list_display = ['model']
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
    pass


admin.site.register(Phone, PhoneAdmin)
admin.site.register(NewiPhone, iPhoneAdmin)
admin.site.register(Memory, MemoryAdmin)
admin.site.register(AllColors, AllColorAdmin)
admin.site.register(Region, RegionAdmin)

'''class categories(admin.ModelAdmin):
    list_display = ('title', 'get_parents', 'when')'''
