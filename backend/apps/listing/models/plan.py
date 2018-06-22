# -*- coding:utf-8 -*-
from django.db import models

from account.models import User
from listing.models.base import Team

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
                                related_name="u_created", on_delete=models.SET_NULL)
    # 执行者类型：团队或者个人
    teams = models.ManyToManyField(verbose_name="执行者(团队)", to=Team, blank=True)
    users = models.ManyToManyField(verbose_name="执行者(用户)", to=User, blank=True)

    is_public = models.BooleanField(verbose_name="公开", blank=True, default=False)

    @property
    def members(self):
        """Plan的所有成员"""
        # 包括Teams中的所有成员和users
        members = self.users.all()
        team_members = User.objects.filter(team__in=self.teams.all())
        # 如果想根据几个分组的id来获取用户可以用这个：
        # users = User.objects.filter(groups__id__in=[1,2])
        if members:
            if team_members:
                members = members.union(team_members)
        return members

    def is_memeber(self, user):
        pass

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
