# -*- coding:utf-8 -*-
from django.db import models

from account.models import User
from docs.models.article import Article


class Common(models.Model):
    """
    文章评论
    """
    article = models.ForeignKey(verbose_name="文章", to=Article, blank=True, on_delete=models.CASCADE)
    content = models.CharField(verbose_name="评论内容", max_length=1024)
    user = models.ForeignKey(verbose_name="用户", to=User, blank=True, null=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey(verbose_name="父级评论", to="self", blank=True, null=True, on_delete=models.CASCADE)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    time_updated = models.DateTimeField(verbose_name="更新时间", blank=True, auto_now=True)
    is_deleted = models.BooleanField(verbose_name="是否删除", blank=True, default=False)

    def delete(self, using=None, keep_parents=False):
        if not self.is_deleted:
            self.is_deleted = True
            self.save()

    def __str__(self):
        return "ID:{}-Artcile({}): Common".format(self.pk, self.article_id)

    class Meta:
        verbose_name = "文章评论"
        verbose_name_plural = verbose_name
