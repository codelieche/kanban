"""
标签相关的Model
1. TagKey：
2. TagValue：
3. ObjectTag: 【重点】
"""
from django.db import models

from account.models import User

# Create your models here.


class TagKey(models.Model):
    """
    标签Model
    """
    key = models.SlugField(verbose_name="key", max_length=40, unique=True)
    name = models.CharField(verbose_name="标签键", max_length=40, blank=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True,
                                   null=True)
    is_hot = models.BooleanField(verbose_name="热门", default=False, blank=True)
    time_added = models.DateTimeField(verbose_name="添加时间", auto_now_add=True, blank=True)
    is_deleted = models.BooleanField(verbose_name="删除", default=False, blank=True)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if not self.name:
            self.name = self.key.capitalize()
        super().save(force_insert=force_insert, force_update=force_update,
                     using=using, update_fields=update_fields)

    def __str__(self):
        return self.key

    def delete(self, using=None, keep_parents=False):
        # print(using, keep_parents)
        self.is_deleted = True
        self.save()

    class Meta:
        verbose_name = "标签键"
        verbose_name_plural = verbose_name
        ordering = ("id",)


class TagValue(models.Model):
    """
    标签值Model
    """
    key = models.ForeignKey(to=TagKey, verbose_name="标签键", related_name="values",
                            on_delete=models.CASCADE)
    value = models.CharField(verbose_name="标签值", max_length=128)
    is_hot = models.BooleanField(verbose_name="热门", default=False, blank=True)
    is_deleted = models.BooleanField(verbose_name="删除", default=False, blank=True)

    def __str__(self):
        return "{}:{}".format(self.key.key, self.value)

    def delete(self, using=None, keep_parents=False):
        self.is_deleted = True
        self.save()
        return False

    class Meta:
        verbose_name = "标签值"
        verbose_name_plural = verbose_name
        unique_together = ("key", "value")


class ObjectTag(models.Model):
    """
    对象的标签 Model
    """
    tagvalue = models.ForeignKey(verbose_name="标签值", to=TagValue,
                                 on_delete=models.CASCADE)
    app_label = models.CharField(verbose_name="App", max_length=40)
    model = models.CharField(verbose_name="Model", max_length=40)
    object_id = models.IntegerField(verbose_name="对象ID")
    user = models.ForeignKey(to=User, verbose_name="添加用户", blank=True, null=True, on_delete=models.CASCADE)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_created=True, null=True)
    is_deleted = models.BooleanField(verbose_name="删除", default=False, blank=True)

    def __str__(self):
        return "{}_{}".format(self.model, self.tagvalue.key)

    class Meta:
        verbose_name = "对象标签"
        verbose_name_plural = verbose_name
