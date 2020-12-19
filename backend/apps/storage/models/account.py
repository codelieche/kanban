# -*- coding:utf-8 -*-
"""
存储账号
"""
from django.db import models
from django.contrib.auth.models import Group

from account.models import User


class Account(models.Model):
    """
    存储账号
    """
    PLATFORM_CHOICES = (
        ('aws', '亚马逊'),
        ('aliyun', '阿里云'),
        ('tencent', '腾讯云'),
        ('qiniu', '七牛')
    )
    user = models.ForeignKey(verbose_name="用户", to=User, on_delete=models.SET_NULL, null=True)
    platform = models.CharField(verbose_name="平台", max_length=10)
    account = models.CharField(verbose_name="账号名字", max_length=60)
    access_key = models.CharField(verbose_name="访问秘钥Key", max_length=100)
    secret_key = models.CharField(verbose_name="秘钥", max_length=100)
    bucket = models.CharField(verbose_name="Bucket", max_length=60)
    domain = models.CharField(verbose_name="访问域名", max_length=100)
    is_default = models.BooleanField(verbose_name="是否默认", blank=True, default=False)
    is_https = models.BooleanField(verbose_name="HTTPS", blank=True, default=False)
    groups = models.ManyToManyField(verbose_name="可以使用的组", to=Group,
                                    blank=True, null=True, related_name="storage_accounts")
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    time_updated = models.DateTimeField(verbose_name="更新时间", blank=True, auto_now=True)
    is_active = models.BooleanField(verbose_name="是否可用", blank=True, default=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, default=True)

    def __str__(self):
        return "{}-{}".format(self.platform, self.account)

    def delete(self, using=None, keep_parents=False):
        if self.is_active:
            self.is_active = False
            self.save()

    class Meta:
        verbose_name = "存储账号"
        verbose_name_plural = verbose_name
