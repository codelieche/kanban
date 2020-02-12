"""
Page相关的Model
"""
from django.db import models


class Page(models.Model):
    """
    Page Model
    """
    title = models.CharField(verbose_name="标题", max_length=256, 
                              blank=True, null=True, db_index=True)
    

    class Meta:
        verbose_name = "页面"
        verbose_name_plural = verbose_name
