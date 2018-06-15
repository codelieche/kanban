# -*- coding:utf-8 -*-
from django.db import models

from account.models import User

STATUS_CHOICES = (
    ("draft", "草稿"),
    ("todo", "待办"),
    ("doing", "进行中"),
    ("done", "完成"),
    ("cancel", "取消")
)

STATUS_CODE_CHOICES = {
    "draft": 0,
    "todo": 5,
    "doing": 10,
    "done": 15,
    "cancel": 20
}

EXECUTED_TYPE_CHOICES = (
    ("user", "用户"),
    ("team", "团队")
)


class Plan(models.Model):
    """
    计划 Model
    """
    name = models.CharField(verbose_name="计划", max_length=128, db_index=True)
    status = models.CharField(verbose_name="状态", max_length=6, db_index=True,
                              choices=STATUS_CHOICES)
    # 每当对象保存的时候更新：status_code
    status_code = models.SmallIntegerField(verbose_name="状态码", blank=True, default=0)
    parent = models.ForeignKey(verbose_name="父计划", to="self", blank=True, null=True,
                               on_delete=models.CASCADE)
    description = models.CharField(verbose_name="描述", max_length=256,
                                   blank=True, null=True)
    is_deleted = models.BooleanField(verbose_name="删除", blank=True, default=False)
    created = models.ForeignKey(to=User, verbose_name="创建者", blank=True, null=True,
                                on_delete=models.SET_NULL)
    executed_type = models.CharField(verbose_name="执行者(类型)", blank=True, default="user",
                                     choices=EXECUTED_TYPE_CHOICES)
    executed_id = models.CharField(verbose_name="执行者(ID)", blank=True, default="user")

    is_public = models.CharField(verbose_name="公开", blank=True, default=False)

    def __str__(self):
        return "Plan:{}".format(self.name)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.status_code = STATUS_CODE_CHOICES[self.status]
        super().save(force_insert=force_insert, force_update=force_update, using=using,
                     update_fields=update_fields)

    class Meta:
        verbose_name = "计划"
        verbose_name_plural = verbose_name
