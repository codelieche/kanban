# -*- coding:utf-8 -*-
from django.db import models

from account.models import User


class Category(models.Model):
    """
    分类
    """
    slug = models.SlugField(verbose_name="分类", max_length=10)
    name = models.CharField(verbose_name="分类名称", max_length=20)
    parent = models.ForeignKey(to="self", verbose_name="父分类", blank=True, null=True,
                               on_delete=models.CASCADE)
    description = models.CharField(verbose_name="描述", blank=True, max_length=256, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "分类"
        verbose_name_plural = verbose_name


class Team(models.Model):
    """
    团队Model
    """
    name = models.CharField(verbose_name="团队名称", max_length=40, unique=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)
    # 成员
    users = models.ManyToManyField(to=User, related_name="members", blank=True)

    def __str__(self):
        return "Team:{}".format(self.name)


