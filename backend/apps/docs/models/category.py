# -*- coding:utf-8 -*-
import sys
from io import BytesIO

from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as PImage, ExifTags

from account.models import User
from utils.store import ImageStorage


class CategoryUser(models.Model):
    """
    分类的用户
    """
    PERMISSION_CHOICES = (
        ("R", "只读"),
        ("RW", "读写"),
        ("ALL", "全部")
    )
    category = models.ForeignKey(verbose_name="分类", to="Category", on_delete=models.CASCADE)
    user = models.ForeignKey(verbose_name="用户", to=User, on_delete=models.CASCADE)
    permission = models.CharField(verbose_name="权限", max_length=10,
                                  choices=PERMISSION_CHOICES, default="R", blank=True)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    is_active = models.BooleanField(verbose_name="有效", blank=True, default=True)

    def delete(self):
        # 不做物理删除，只标记删除
        # 注意：如果修改Category传递了users，是会对CategoryUser做物理删除的，后续可优化
        if self.is_active:
            self.is_active = False
            self.save()

    class Meta:
        unique_together = ("category", "user")  # 联合唯一索引
        verbose_name = "分组用户"
        verbose_name_plural = verbose_name


class Category(models.Model):
    """
    文档的分类
    """
    name = models.CharField(verbose_name="名称", max_length=40, db_index=True)
    code = models.SlugField(verbose_name="代码", max_length=128, unique=True)
    image = models.ImageField(verbose_name="图标", upload_to="docs/category/%Y/%m", storage=ImageStorage(),
                              help_text="图片路径", blank=True, null=True)
    description = models.CharField(verbose_name="描述", max_length=1024, blank=True, null=True)
    parent = models.ForeignKey(verbose_name="父级分类", related_name="children",
                               blank=True, null=True, to="self", on_delete=models.CASCADE)
    # 默认情况下：创建者就是当前分类的所有者，后续可以转交给他人，owner拥有所有的权限
    owner = models.ForeignKey(to=User, verbose_name="所有者", related_name="owner_category_set",
                              blank=True, null=True, on_delete=models.SET_NULL)
    users = models.ManyToManyField(verbose_name="用户", to=User, 
                                   through=CategoryUser, through_fields=("category", "user"))
    # level级别 和 顺序 order
    level = models.SmallIntegerField(verbose_name="级别", blank=True, default=1)
    order = models.SmallIntegerField(verbose_name="顺序", blank=True, default=1)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    is_deleted = models.BooleanField(verbose_name="是否删除", blank=True, default=False)

    def check_user_permission(self, user, permission="read"):
        """
        判断用户是否有分类的Read/Write/Delete权限
        """
        # 如果用户是超级用户就赋予全部的权限
        if user.is_superuser:
            return True
        # 分类的所有者也拥有所有权限
        elif self.owner == user:
            return True
        
        # 校验需要检查的权限是否合理
        permission = permission.lower()
        # 全部的权限：后续可优化鉴权的方式
        all = ("read", "write", "update", "delete", "all", "add_user", "delete_user", "update_user")
        if permission not in all:
            return False
        
        # 获取到CategoryUser对象
        category_user = CategoryUser.objects.filter(category=self, user=user).first()

        # 如果不存在，或者用户不是激活的，则无权限
        if not category_user or (not category_user.is_active):
            return False
        
        # 开始判断
        permission_dict = {
            "R": ["read"],  # 只读权限
            "RW": ("read", "write", "update", "delete"),  # 可写权限
            "ALL": all  # 全部权限
        }
        
        if (category_user.permission in permission_dict) \
             and (permission in permission_dict[category_user.permission]):
             return True
        else:
            return False


    def __str__(self):
        return "{}:{}".format(self.code, self.name)

    def save(self, *args, **kwargs):
        # 自动计算level
        level = 1
        parent = self.parent
        while parent:
            level += 1
            parent = parent.parent
        # 给leve赋值
        self.level = level

        if not self.id and self.image:
            self.file = self.resize_image(self.image)
        super().save(*args, **kwargs)

    def delete(self):
        if not self.is_deleted:
            self.is_deleted = True
            self.save()
        return

    @property
    def users_permisson(self):
        # 不返回全部，只返回有效的用户
        return self.categoryuser_set.filter(is_active=True)

    def resize_image(self, image_file):
        """
        对图片大小进行缩放
        :param image_file: 图片对象
        :return:
        """
        if image_file.file.content_type != "image/jpeg" and image_file.size < 600 * 1024:
            return image_file

        if image_file.file.content_type == "image/gif":
            return image_file

        image_tmp = PImage.open(image_file)

        # 方向处理
        try:
            if image_tmp._getexif():
                exif = dict(image_tmp._getexif().items())

                for orientation in ExifTags.TAGS.keys():
                    if ExifTags.TAGS[orientation] == "Orientation":
                        break
                if orientation in exif:
                    if exif[orientation] == 3:
                        image_tmp = image_tmp.rotate(180, expand=True)
                    elif exif[orientation] == 6:
                        image_tmp = image_tmp.rotate(270, expand=True)
                    elif exif[orientation] == 8:
                        image_tmp = image_tmp.rotate(90, expand=True)
        except Exception as e:
            print(e)

        output_io_stream = BytesIO()
        w, h = image_tmp.size

        scale = 1
        if w > 1600:
            scale = 1600.0 / w
        image_resize = image_tmp.resize((int(w * scale), int(h * scale)))
        image_resize.save(output_io_stream, format='JPEG', quality=80)
        output_io_stream.seek(0)
        image = InMemoryUploadedFile(
            output_io_stream,
            'ImageField',
            "%s.jpg" % image_file.name.split('.')[0],
            'image/jpeg',
            sys.getsizeof(output_io_stream),
            None
        )
        return image

    class Meta:
        verbose_name = "文档分类"
        verbose_name_plural = verbose_name


