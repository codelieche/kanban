"""
Page相关的Model
"""
from django.db import models

from account.models import User


class Page(models.Model):
    """
    Page Model
    """

    CATEGORY_CHOICES = (
        ("docs", "文档"),
        ("kanban", "看板")
    )
    
    title = models.CharField(verbose_name="标题", max_length=256, 
                              blank=True, null=True, db_index=True)
    category = models.CharField(verbose_name="类型", blank=True, default="docs")
    icon = models.CharField(verbose_name="图标", max_length=256, blank=True, null=True)
    description = models.CharField(verbose_name="描述", max_length=1024, blank=True, null=True)
    user = models.ForeignKey(verbose_name="创建者", blank=True, on_delete=models.SET_NULL, blank=True)
    # 文章顶部的封面
    cover = models.CharField(verbose_name="封面", max_length=256, blank=True, null=True)
    # 无线内联
    parent = models.ForeignKey(to="self", verbose_name="父页面", blank=True, 
                               on_delete=models.CASCADE, related_name="children")
    # 文章内容
    content = models.TextField(verbose_name="内容", blank=True, null=True)

    # 文章排序，越小的排前面
    order = models.SmallIntegerField(verbose_name="排序", default=1, blank=True)
    # 添加时间
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    time_updated = models.DateTimeField(verbose_name="修改时间", blank=True, auto_now=True)
    # 文章的内容是一系列的block
    is_active = models.BooleanField(verbose_name="有效", blank=True, default=True)


    class Meta:
        verbose_name = "页面"
        verbose_name_plural = verbose_name
