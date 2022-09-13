from django.contrib import admin

# Register your models here.
from siteservice.forms import ProfileForm
from siteservice.models import Memory, AllColors, iPhone, Phone, MacBook, iMac, OperatingSystem, Region, NewMacBook


def not_available(modeladmin, request, queryset):
    queryset.update(status='n')


not_available.short_description = "Нет в наличии"


def available(modeladmin, request, queryset):
    queryset.update(status='y', )


available.short_description = "В наличии"


# Define the admin class
# @admin.register(Iphone)
class PhoneAdmin(admin.ModelAdmin):
    list_display = (
        'model_phone', 'memory_phone', 'colors_phone',
        'region_phone', 'price_phone',
        'new_or_used', 'created_at', 'status',)

    # list_select_related = (
    #     'model_phone', 'memory_phone', 'colors_phone',
    #     'region_phone', 'price_phone',
    #     'new_or_used', 'created_at', 'status',)

    search_fields = ('model_phone', 'memory_phone', 'colors_phone',)
    # form = ProfileForm
    list_filter = ('model_phone', 'memory_phone', 'colors_phone',)
    actions = [not_available, available]


class NewMacBookAdmin(admin.ModelAdmin):
    list_display = (
        'macbook_model', 'diagonal',
        'years_macbook', 'chip',
        'mac_memory', 'mac_color',
        'mac_region', 'created_at', 'availability_mac',)
    # list_select_related = (
    #     'macbook_model', 'diagonal',
    #     'years_macbook', 'chip',
    #     'mac_memory', 'mac_color',
    #     'mac_region', 'availability_mac',)


# @admin.register(Apple)
class iPhoneAdmin(admin.ModelAdmin):
    list_display = ('iphone_name',)
    search_fields = ('iphone_name',)
    #list_select_related = ('model_phone',)


#
@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    pass


#
@admin.register(AllColors)
class AllColorsAdmin(admin.ModelAdmin):
    pass


# @admin.register(UsedPhones)
# class UsedAdmin(admin.ModelAdmin):
#     pass


@admin.register(iMac)
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
admin.site.register(iPhone, iPhoneAdmin)
admin.site.register(NewMacBook, NewMacBookAdmin)

'''class categories(admin.ModelAdmin):
    list_display = ('title', 'get_parents', 'when')'''
