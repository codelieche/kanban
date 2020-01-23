# -*- coding:utf-8 -*-
from django.db import models

from account.models import User
from jobs.models.job import Job
from docs.models.category import Category


class Article(models.Model):
    """
    Article Model
    """
    # 文章可以属于多个分类
    categories = models.ManyToManyField(verbose_name="分类", to=Category, blank=True, null=True)
    title = models.CharField(verbose_name="标题", max_length=128)
    content = models.TextField(verbose_name="文章内容")
    # 文章可属于多个任务，每个任务都有自己的相关文档
    jobs = models.ManyToManyField(verbose_name="分组", blank=True, null=True, to=Job)
    user = models.ForeignKey(verbose_name="作者", to=User, blank=True, null=True, on_delete=models.SET_NULL)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, null=True, auto_created=True)
    time_updated = models.DateTimeField(verbose_name="更新时间", blank=True, auto_now=True)
    is_deleted = models.BooleanField(verbose_name="是否删除", blank=True, default=False)

    def __str__(self):
        return "ID-{}:{}".format(self.pk, self.title)

    def delete(self, using=None, keep_parents=False):
        if not self.is_deleted:
            self.is_deleted = True
            self.save()

    class Meta:
        verbose_name = "文章"
        verbose_name_plural = verbose_name
