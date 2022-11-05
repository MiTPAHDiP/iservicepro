from django.test import TestCase

# Create your tests here.
# class UsedIPhones(models.Model):
#     name_iphone = models.ForeignKey(to=Phone, on_delete=models.CASCADE, max_length=250)
#     memory_info = models.CharField(max_length=100, help_text='Выберите память')
#     colors_name = models.CharField(max_length=100, help_text="Выберите цвет")
#     region_name = models.CharField(max_length=100)
#     photo_phone = models.ImageField(upload_to='photos_used/%Y/%m/%d', blank=True)
#     about_phone = models.CharField(max_length=255, null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     update_at = models.DateTimeField(auto_now=True)
#     availability_phone = models.BooleanField(default=False)
#
#     def __str__(self):
#         return f'{self.name_iphone}' \
#                f'{self.memory_info}' \
#                f'{self.colors_name}' \
#                f'{self.region_name}' \
#                f'{self.photo_phone}' \
#                f'{self.about_phone}'
#
#     class Meta:
#         verbose_name = 'Б/У iPhone'
#         verbose_name_plural = 'Б/У iPhone'
#         ordering = ['-name_iphone']

# def get_memory(self):
# return ', '.join([Memory.memory_info for Memory in self.memory_phone.all()])
# get_memory.short_description = 'Память'
# def display_color(self):
# return ', '.join([AllColors.name_colors for AllColors in self.colors_phone.all()])
# display_color.short_description = 'Цвета'
# def get_region(self):
# Создает строку для цвета. Это необходимо для отображения цвета в Admin.
# return ", ".join([Region.region_name for Region in self.region_phone.all()])
# get_region.short_description = 'Регион'
# python3 manage.py shell_plus --print-sql
# urls.py
# Create your models here.
# class User(models.Model):
#     user = models.CharField()
#
#
# class Profile(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, help_text='Выберите модель', verbose_name='Модель')
#     email = models.CharField()
#     country = models.CharField()
# def get_region(self):
#     return ",".join([r.region for r in self.region_name.all()])
#
# def __unicode__(self):
#     return "{0}".format(self.title)


# # Навзание Mac OS
# class OperatingSystem(models.Model):
#     mac_os = models.CharField(max_length=200, help_text='Введите название Операционной системы')
#
#     def __str__(self):
#         return self.mac_os
#
#     class Meta:
#         verbose_name = 'Операционная система'
#         verbose_name_plural = 'Операционная система'
#
#


# def get_memory(self):
#     return "\n".join([p.memory for p in self.memory_phone.all()])
#
# def get_colors(self):
#     return "\n".join([p.colors for p in self.colors_phone.all()])
#
# def get_region(self):
#     return "\n".join([p.memory for p in self.memory_phone.all()])

# def get_absolute_url(self):
#     """
#     Возвращает URL-адрес для доступа к конкретному экземпляру.
#     """
#     return reverse('iphone-detail', args=[str(self.id)])
# def display_memory(self):
#     """
#     Создает строку для цвета. Это необходимо для отображения цвета в Admin.
#     """
#     return ', '.join([Memory.memory for Memory in self.memory_phone.all()])
#
# display_memory.short_description = 'Память'
#
# def display_color(self):
#     """
#     Создает строку для цвета. Это необходимо для отображения цвета в Admin.
#     """
#     return ', '.join([AllColors.colors for AllColors in self.colors_phone.all()])
#
# display_color.short_description = 'Цвета'
#
# def display_region(self):
#     """
#     Создает строку для цвета. Это необходимо для отображения региона в Admin.
#     """
#     return ', '.join([Region.regions for Region in self.region_phone.all()])
#
# display_region.short_description = 'Регион'