# -*- coding:utf-8 -*-
from django.db import models

from account.models import User
from jobs.models.job import Job


class Common(models.Model):
    """
    任务评论
    """
    job = models.ForeignKey(verbose_name="任务", to=Job, blank=True, on_delete=models.CASCADE)
    content = models.CharField(verbose_name="内容", max_length=1024)
    user = models.ForeignKey(verbose_name="评论用户", to=User, related_name="jobs_common_set",
                             blank=True, on_delete=models.CASCADE)
    parent = models.ForeignKey(verbose_name="评论的评论", to="self", blank=True, null=True, on_delete=models.CASCADE)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    is_deleted = models.BooleanField(verbose_name="是否删除", blank=True, default=False)

    def delete(self):
        if not self.is_deleted:
            self.is_deleted = True
            self.save()
        return

    class Meta:
        verbose_name = "任务评论"
        verbose_name_plural = verbose_name

