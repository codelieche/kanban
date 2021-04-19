# -*- coding:utf-8 -*-
"""
系统配置Model
"""

from django.db import models
from utils.tools.password import Cryptography

# from account.models import User


class Config(models.Model):
    CATEGORY_CHOICES = (
        ('text', '文本'),
        ('number', '数字'),
        ('int', '整数'),
        ('float', '浮点数'),
        ('json', 'Json对象'),
    )
    code = models.SlugField(verbose_name="配置", max_length=128, unique=True)
    name = models.CharField(verbose_name="配置名称", max_length=128, blank=True, null=True)
    # 因为配置值，有些是模板文件，可能会比较长，故直接使用Text类型
    value = models.TextField(verbose_name="值", blank=True)
    category = models.CharField(verbose_name="类型", max_length=10, default="text")
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)
    # created = models.CharField(verbose_name="创建用户", max_length=60, blank=True, null=True)
    time_added = models.BooleanField(verbose_name="添加时间", auto_created=True, blank=True)
    is_secret = models.BooleanField(verbose_name="是否加密", blank=True, default=False)
    is_active = models.BooleanField(verbose_name="状态", blank=True, default=True)

    @classmethod
    def create_or_get_instance(cls, code: str, value: str = "", description: str = None):
        if not code:
            print('请传入配置的Code')
            return None
        else:
            instance, created = cls.objects.get_or_create(code=code)
            if created:
                instance.value = value
                instance.name = code
                instance.description = description
                instance.save()
            # 返回获取还活着创建的实例
            return instance

    @property
    def value_decrypt(self):
        """获取值，有可能是明文的，也可能是需要解密一下的"""
        if self.is_secret:
            p = Cryptography()
            success, de_p = p.check_can_decrypt(value=self.value)
            if success:
                return de_p
            else:
                return None
        else:
            return self.value

    def __bool__(self):
        if not self.value:
            return False
        elif self.value in {'None', 'null', 'false', 'False', '0', 0, 0.0}:
            return False
        else:
            True

    def __str__(self):
        return "配置:{}".format(self.code)

    def delete(self, using=None, keep_parents=False):
        if self.is_active:
            self.is_active = False
            self.save()
        else:
            # 调用父方法，直接删除
            super().delete(using=using, keep_parents=keep_parents)
        return

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        # value可以加密，也可不加密
        # 加密的key使用settings中统一配置的
        if self.is_secret:
            p = Cryptography()
            success, _ = p.check_can_decrypt(value=self.value)
            # 解密失败，就表示其不是加密后的值
            if not success:
                self.value = p.encrypt(text=self.value)
            # 对value加密完毕

        # 调用父类方法
        return super().save(force_insert=force_insert, force_update=force_update, using=using,
                            update_fields=update_fields)

    class Meta:
        verbose_name = "配置"
        verbose_name_plural = verbose_name
