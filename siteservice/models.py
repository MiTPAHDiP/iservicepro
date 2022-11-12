from datetime import datetime

from django.db import models

# import uuid  # Required for unique book instances

# Create your models here.
from django.urls import reverse

STATUS_CHOICES = [
    ('available', 'В наличии'),
    ('not_available', 'Нет в наличии')]

ACT_OR_NOT_CHOICES = [
    ('activ', 'Предактив'),
    ('new', 'Новый'),
    ('used', 'Б/У')]


# ('w', 'Withdrawn'),

# флеш память
class Memory(models.Model):
    memory = models.CharField(max_length=100, help_text='Введите память в формате ...гб')

    def __str__(self):
        return self.memory

    class Meta:
        verbose_name = 'Объем памяти'
        verbose_name_plural = 'Объемы памяти'


# # БД всех цветов
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

    class Meta:
        verbose_name = 'Цвета'
        verbose_name_plural = 'Цвета'


# Название стран
class Region(models.Model):
    regions = models.CharField(max_length=100,
                               help_text="Введите регион в виде Флага.",
                               verbose_name='Название Региона')

    def __str__(self):
        """
        Строка для представления объекта модели (на сайте администратора и т. д.)
        """
        return self.regions

    def __unicode__(self):
        return "{0}".format(self.regions)

    class Meta:
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'


# Навзание моделей айфон
class Phone(models.Model):
    name = models.CharField(max_length=150, verbose_name='Названия моделей iPhone')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'iPhone'
        verbose_name_plural = 'iPhone'
        ordering = ['name']


# Навзание моделей айфон
class ModelMacBook(models.Model):
    macbook_name = models.CharField(max_length=150, verbose_name='Модель MacBook')

    def __str__(self):
        return self.macbook_name

    class Meta:
        verbose_name = 'MacBook'
        verbose_name_plural = 'MacBook'


# Названия моделей iMac
class iMacModels(models.Model):
    imac_model = models.CharField(max_length=150, db_index=True)

    def __str__(self):
        return self.imac_model

    class Meta:
        verbose_name = 'iMac'
        verbose_name_plural = 'iMac'


class NewIphoneQuereset(models.QuerySet):
    def available(self):
        return self.filter(status='available')

    def not_available(self):
        return self.filter(status='not_available')


class NewIphoneManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='available')

    def used(self):
        return self.get_queryset().filter(activ_or_not='used')

    def new(self):
        return self.get_queryset().filter(activ_or_not='new')

    def activ(self):
        return self.get_queryset().filter(activ_or_not='activ')

    def available(self):
        return self.get_queryset().available()

    def not_available(self):
        return self.get_queryset().not_available()


class NewiPhone(models.Model):
    model_phone = models.ForeignKey(Phone, on_delete=models.CASCADE, help_text='Выберите модель', verbose_name='Модель')
    memory_phone = models.ForeignKey(Memory, on_delete=models.PROTECT, help_text="Выберите память",
                                     verbose_name='Память')
    colors_phone = models.ForeignKey(AllColors, on_delete=models.PROTECT, max_length=10, help_text="Выберите цвет",
                                     verbose_name='Цвет')
    region_phone = models.ForeignKey(Region, max_length=30, on_delete=models.PROTECT, help_text="Выберите регион",
                                     verbose_name='Регион')
    price_phone = models.IntegerField(verbose_name='Стоимость', null=True)
    photo_phone = models.ImageField(upload_to='photos/%Y/%m/%d', blank=True, verbose_name='Фото файлы')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    update_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available', blank=True)
    activ_or_not = models.CharField(max_length=15, choices=ACT_OR_NOT_CHOICES, default='new', blank=True,
                                    verbose_name='Новый или актив')
    objects = models.Manager()
    status_object = NewIphoneManager()
    #objects = NewIphoneQuereset.as_manaager()

    def __str__(self):
        """
        Строка для представления объекта Model.
        """
        return f'{self.model_phone} ' \
               f'{self.memory_phone} ' \
               f'{self.colors_phone} ' \
               f'{self.region_phone} ' \
               f'{self.price_phone} '

    class Meta:
        verbose_name = 'Новый iPhone'
        verbose_name_plural = 'Новые iPhone'


class MacBook(models.Model):
    model = models.ForeignKey(ModelMacBook, on_delete=models.CASCADE, max_length=150, verbose_name='Модель')
    serial_name = models.CharField(max_length=100, verbose_name='Серия MacBook')
    years = models.CharField(max_length=100, null=True, verbose_name='Год')
    mac_color = models.ForeignKey(AllColors, on_delete=models.PROTECT, help_text="Выберите цвет", verbose_name='Цвет')
    mac_memory = models.ForeignKey(Memory, on_delete=models.PROTECT, help_text='Выберите память', verbose_name='Память')
    ram = models.CharField(max_length=10, help_text='Оперативка', verbose_name='Оперативка')
    mac_region = models.ForeignKey(Region, on_delete=models.PROTECT, max_length=100, verbose_name='Страна')
    price_mac = models.IntegerField(verbose_name='Стоимость', null=True)
    operating_system = models.CharField(max_length=250, verbose_name='Оперционная система', blank=True)
    photo_phone = models.ImageField(upload_to='photos_imac/%Y/%m/%d', blank=True, verbose_name='Фото')
    retina_lcd = models.BooleanField(default=True, null=True, verbose_name='Ретина')
    diagonal = models.CharField(max_length=150, null=True, verbose_name='Диагональ', blank=True)
    description = models.CharField(max_length=255, null=True, blank=True, verbose_name='Комментарии')
    chip = models.CharField(max_length=100, null=True, verbose_name='Процессор')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available', blank=True)
    activ_or_not = models.CharField(max_length=15, choices=ACT_OR_NOT_CHOICES, default='new', blank=True,
                                    verbose_name='Новый или актив')
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.model}\n' \
               f'{self.serial_name} ' \
               f'({self.chip}/{self.ram}/{self.mac_memory}) ' \
               f'{self.mac_color} ' \
               f'{self.mac_region} ' \
               f'{self.price_mac} ' \
               f'{self.status} '

    class Meta:
        verbose_name = 'Новый MacBook'
        verbose_name_plural = 'Новые MacBook'
        ordering = ['-model']

    '''def save(self, *args, **kwargs):
        self.last_updated_dt = datetime.now()
        super().save(*args, **kwargs)'''


#
# # Модель БД iMac
class iMac(models.Model):
    model_imac = models.ForeignKey(iMacModels, on_delete=models.CASCADE)
    serial_name = models.CharField(max_length=100, verbose_name='Серия iMac')
    years = models.IntegerField(verbose_name='год', blank=True)
    imac_color = models.ForeignKey(AllColors, on_delete=models.PROTECT, help_text="Выберите цвет")
    imac_memory = models.ForeignKey(Memory, on_delete=models.PROTECT, help_text='Выберите память')
    imac_region = models.ForeignKey(Region, on_delete=models.PROTECT, max_length=150)
    articles = models.CharField(max_length=155)
    operating_system = models.CharField(max_length=250)
    photo_phone = models.ImageField(upload_to='photos_imac/%Y/%m/%d', blank=True)
    diagonal = models.CharField(max_length=150, null=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    chip = models.CharField(max_length=100, null=True)
    activ_or_not = models.CharField(max_length=15, choices=ACT_OR_NOT_CHOICES, default='new', blank=True,
                                    verbose_name='Новый или актив')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available', blank=True)

    def __str__(self):
        return self.model_imac

    class Meta:
        verbose_name = 'iMac'
        verbose_name_plural = 'iMac'
        ordering = ['-model_imac']
