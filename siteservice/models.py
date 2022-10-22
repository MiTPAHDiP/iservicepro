from datetime import datetime

from django.db import models

# import uuid  # Required for unique book instances

# Create your models here.
from django.urls import reverse

STATUS_CHOICES = [
    ('y', 'В наличии'),
    ('n', 'Нет в наличии')]


# ('w', 'Withdrawn'),


# БД всех цветов
class AllColors(models.Model):
    '''Эта модель используется для хранения информации о цветах'''
    colors = models.CharField(max_length=200,
                              help_text="Введите цвет на англ.",
                              verbose_name='Название цвета')

    def __str__(self):
        """
        Строка для представления объекта модели (на сайте администратора и т. д.)
        """
        return self.colors

    # def display_color(self):
    #     """
    #     Создает строку для цвета. Это необходимо для отображения цвета в Admin.
    #     """
    #     return ', '.join([AllColors.name_colors for AllColors in self.name_colors.all()])
    #
    # display_color.short_description = 'Цвета'

    class Meta:
        verbose_name = 'Цвета'
        verbose_name_plural = 'Цвета'


# Название стран
class Region(models.Model):
    regions = models.CharField(max_length=100, verbose_name='Название Региона')

    def __str__(self):
        """
        Строка для представления объекта модели (на сайте администратора и т. д.)
        """
        return self.regions

    class Meta():
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'

    # def get_region(self):
    #     return ",".join([r.region for r in self.region_name.all()])
    #
    # def __unicode__(self):
    #     return "{0}".format(self.title)


# Навзание Mac OS
class OperatingSystem(models.Model):
    mac_os = models.CharField(max_length=200, help_text='Введите название Операционной системы')

    def __str__(self):
        return self.mac_os

    class Meta:
        verbose_name = 'Операционная система'
        verbose_name_plural = 'Операционная система'


# флеш память
class Memory(models.Model):
    memory = models.CharField(max_length=100, help_text='Введите память в формате ...гб')

    def __str__(self):
        return self.memory

    class Meta:
        verbose_name = 'Объем памяти'
        verbose_name_plural = 'Объем памяти'


# Навзание моделей айфон
class Phone(models.Model):
    phone_name = models.CharField(max_length=150, verbose_name='Названия моделей iPhone')

    def __str__(self):
        return 'iPhone %s' % (self.phone_name)
        # return self.phone_name

    class Meta:
        verbose_name = 'iPhone'
        verbose_name_plural = 'iPhone'
        ordering = ['phone_name']


# Навзание моделей айфон
class MacBook(models.Model):
    macbook_name = models.CharField(max_length=150, verbose_name='Модель MacBook')

    def __str__(self):
        return self.macbook_name

    class Meta:
        verbose_name = 'MacBook'
        verbose_name_plural = 'MacBook'


# Навзания моделей iMac
class Model_iMac(models.Model):
    imac_model = models.CharField(max_length=150, db_index=True)

    def __str__(self):
        return self.imac_model

    class Meta:
        verbose_name = 'iMac'
        verbose_name_plural = 'iMac'


class NewiPhone(models.Model):
    model_phone = models.ForeignKey(to=Phone, on_delete=models.CASCADE, help_text='Выберите модель',
                                    verbose_name='Модель')
    memory_phone = models.ManyToManyField(Memory, help_text="Выберите память",
                                          verbose_name='Память', related_name='n')
    colors_phone = models.ManyToManyField(AllColors, help_text="Выберите цвет",
                                          verbose_name='Цвет')
    region_phone = models.ManyToManyField(Region, help_text="Выберите регион",
                                          verbose_name='Регион')
    price_phone = models.IntegerField(verbose_name='Стоимость')
    photo_phone = models.ImageField(upload_to='photos/%Y/%m/%d', blank=True, verbose_name='Фото файлы')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    update_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='В наличии')
    new_or_used = models.BooleanField(default=True, verbose_name='Новый')

    def get_memory(self):
        return "\n".join([p.memory for p in self.memory_phone.all()])

    def get_colors(self):
        return "\n".join([p.colors for p in self.colors_phone.all()])

    def get_region(self):
        return "\n".join([p.memory for p in self.memory_phone.all()])

    # def get_absolute_url(self):
    #     """
    #     Возвращает URL-адрес для доступа к конкретному экземпляру.
    #     """
    #     return reverse('iphone-detail', args=[str(self.id)])

    def __str__(self):
        """
        Строка для представления объекта Model.
        """
        return f'{self.model_phone}' \
               f'{self.memory_phone} ' \
               f'{self.colors_phone}' \
               f'{self.region_phone}' \
               f'{self.price_phone}'

    class Meta:
        verbose_name = 'Новый iPhone'
        verbose_name_plural = 'Новые iPhone'


# Модель БД iMac
class Imac(models.Model):
    model_imac = models.ForeignKey(Model_iMac, on_delete=models.CASCADE)
    years_imac = models.CharField(max_length=100)
    imac_color = models.ManyToManyField(AllColors, help_text="Выберите цвет")
    imac_memory = models.ManyToManyField(Memory, help_text='Выберите память')
    imac_region = models.ManyToManyField(Region, max_length=150)
    model_id = models.CharField(max_length=155)
    articles = models.CharField(max_length=155)
    operating_system = models.ManyToManyField(OperatingSystem, max_length=250)
    photo_phone = models.ImageField(upload_to='photos_imac/%Y/%m/%d', blank=True)
    diagonal = models.CharField(max_length=150, null=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    chip = models.CharField(max_length=100, null=True)
    new_or_used = models.BooleanField(verbose_name='Новый', default=True)
    availability_phone = models.BooleanField(default=True, choices=STATUS_CHOICES, verbose_name='В наличии')

    def __str__(self):
        return self.model_imac

    class Meta:
        verbose_name = 'iMac'
        verbose_name_plural = 'iMac'
        ordering = ['-model_imac']


class UsedIPhones(models.Model):
    name_iphone = models.ForeignKey(to=Phone, on_delete=models.CASCADE, max_length=250)
    memory_info = models.ManyToManyField(Memory, help_text='Выберите память')
    colors_name = models.ManyToManyField(AllColors, help_text="Выберите цвет")
    region_name = models.ManyToManyField(Region, max_length=100)
    photo_phone = models.ImageField(upload_to='photos_used/%Y/%m/%d', blank=True)
    about_phone = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    availability_phone = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.name_iphone}' \
               f'{self.memory_info}' \
               f'{self.colors_name}' \
               f'{self.region_name}' \
               f'{self.photo_phone}' \
               f'{self.about_phone}'

    class Meta:
        verbose_name = 'Б/У iPhone'
        verbose_name_plural = 'Б/У iPhone'
        ordering = ['-name_iphone']


#
class NewMacBook(models.Model):
    model_macbook = models.ForeignKey(MacBook, on_delete=models.CASCADE, max_length=150, null=True,
                                      verbose_name='Модель')
    years_macbook = models.CharField(max_length=100, null=True, verbose_name='Год')
    mac_color = models.ManyToManyField(AllColors, help_text="Выберите цвет", verbose_name='Цвет')
    mac_memory = models.ManyToManyField(Memory, help_text='Выберите память', verbose_name='Память')
    mac_region = models.ManyToManyField(Region, max_length=100, verbose_name='Страна')
    operating_system = models.ManyToManyField(OperatingSystem, max_length=250,
                                              verbose_name='Оперционная система')
    photo_phone = models.ImageField(upload_to='photos_imac/%Y/%m/%d', blank=True, verbose_name='Фото')
    retina_lcd = models.BooleanField(default=True, null=True, verbose_name='Ретина')
    diagonal = models.CharField(max_length=150, null=True, verbose_name='Диагональ', blank=True)
    description = models.CharField(max_length=255, null=True, blank=True, verbose_name='Комментарии')
    chip = models.CharField(max_length=100, null=True, verbose_name='Процессор')
    availability_mac = models.BooleanField(default=True, verbose_name='В наличии', choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.model_macbook}' \
               f'{self.diagonal}' \
               f' {self.years_macbook}' \
               f' {self.chip}' \
               f' {self.mac_region}' \
               f' {self.mac_color}' \
               f' {self.mac_memory}' \
               f' {self.operating_system}' \
               f'{self.availability_mac}' \
               f'{self.created_at}'

    class Meta:
        verbose_name = 'Новый MacBook'
        verbose_name_plural = 'Новые MacBook'
        ordering = ['-model_macbook']

    '''def save(self, *args, **kwargs):
        self.last_updated_dt = datetime.now()
        super().save(*args, **kwargs)'''

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
