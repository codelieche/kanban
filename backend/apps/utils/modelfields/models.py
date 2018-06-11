"""
model的字段信息
【注意后续会有另外一种设计，model的字段(为了弹性添加model的属性而设计的)】：
- 目的：通过简单的配置，得到获取到的数据的基本字段信息，
前端根据这个简单的基本信息渲染数据。

- FieldInfo: 字段信息
    field:
    name:
    category: list, object, field（三种）

- ModelField: 模型的field
    app_label:
    model：
    category: 分类：default、list、detail、search等
    field: FieldInfo的外键
    description: 描述一下

"""
from django.db import models

# Create your models here.


class FieldCategory(models.Model):
    """
    字段的类型
    FieldInfo.fields
    object：表示这个, fields组成一个对象
    list: 表示：fields组成一个数组
    field: 表示：这个field没有fields：
    """
    category = models.CharField(verbose_name="字段类型", unique=True, max_length=10)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)

    def __str__(self):
        return self.category

    class Meta:
        verbose_name = "字段类型"
        verbose_name_plural = verbose_name


class FieldInfo(models.Model):
    """
    基础的字段信息
    """
    field = models.CharField(verbose_name="字段", max_length=40)
    name = models.CharField(verbose_name="字段名称", max_length=40, blank=True, null=True)
    category = models.ForeignKey(verbose_name="字段类型")
    fields = models.ManyToManyField(to="self", related_name="fields", blank=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)

    def __str__(self):
        return "{}({}):{}".format(self.field, self.name, self.category)

    class Meta:
        verbose_name = "字段基础信息"
        verbose_name_plural = verbose_name


class ModelFieldsCategory(models.Model):
    """
    Model字段的分类
    """
    category = models.CharField(verbose_name="类型", max_length=40, default="default", blank=True)
    descritption = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)

    def __str__(self):
        return self.category

    class Meta:
        verbose_name = "Model字段信息的类型"
        verbose_name_plural = verbose_name


class ModelFields(models.Model):
    """
    模型的字段信息 Model
    """
    app_label = models.CharField(verbose_name="App Label", max_length=40)
    model = models.CharField(verbose_name="Model", max_length=40)
    fields = models.ManyToManyField(to=FieldInfo, verbose_name="字段")
    category = models.CharField(verbose_name="类型", default="default", blank=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)

    def __str__(self):
        return "{}({}):fields".format(self.model, self.app_label)

    class Meta:
        verbose_name = "模型字段"
        verbose_name_plural = verbose_name
        unique_together = ("app_label", "model", "cateogry")
