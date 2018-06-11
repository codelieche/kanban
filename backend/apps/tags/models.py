from django.db import models

# Create your models here.


class Tag(models.Model):
    """
    标签Model
    """
    tag = models.SlugField(verbose_name="Tag", max_length=40, db_index=True)
    name = models.CharField(verbose_name="标签", max_length=40, blank=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True,
                                   null=True)
    is_hot = models.BooleanField(verbose_name="热门", default=False, blank=True)
    is_deleted = models.BooleanField(verbose_name="删除", default=False, blank=True)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if not self.name:
            self.name = self.tag.capitalize()
        super().save(force_insert=force_insert, force_update=force_update,
                     using=using, update_fields=update_fields)

    def __str__(self):
        return self.tag

    def delete(self, using=None, keep_parents=False):
        # print(using, keep_parents)
        self.is_deleted = True
        self.save()

    class Meta:
        verbose_name = "标签"
        verbose_name_plural = verbose_name
        ordering = ("id",)


class TagValue(models.Model):
    """
    标签值Model
    """
    tag = models.ForeignKey(to=Tag, verbose_name="标签", related_name="values",
                            on_delete=models.CASCADE)
    value = models.CharField(verbose_name="值", max_length=128)
    # is_deleted = models.BooleanField(verbose_name="删除", default=False, blank=True)

    def __str__(self):
        return "{}:{}".format(self.tag.tag, self.value)

    def delete(self, using=None, keep_parents=False):
        # self.is_deleted = True
        # self.save()
        return False

    class Meta:
        verbose_name = "标签值"
        verbose_name_plural = verbose_name
        unique_together = ("tag", "value")


class ObjectTag(models.Model):
    """
    对象的标签 Model
    """
    tagvalue = models.ForeignKey(verbose_name="标签值", to=TagValue,
                                 on_delete=models.CASCADE)
    app_label = models.CharField(verbose_name="App", max_length=40)
    model = models.CharField(verbose_name="Model", max_length=40)
    object_id = models.IntegerField(verbose_name="对象ID")
    is_deleted = models.BooleanField(verbose_name="删除", default=False, blank=True)

    def __str__(self):
        return "{}_{}".format(self.model, self.tagvalue.tag)

    class Meta:
        verbose_name = "对象标签"
        verbose_name_plural = verbose_name
