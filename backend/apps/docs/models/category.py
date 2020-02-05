# -*- coding:utf-8 -*-
import sys
from io import BytesIO

from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as PImage, ExifTags

from utils.store import ImageStorage


class Category(models.Model):
    """
    文档的分类
    """
    name = models.CharField(verbose_name="名称", max_length=40, db_index=True)
    code = models.CharField(verbose_name="代码", max_length=20, unique=True)
    image = models.ImageField(verbose_name="图标", upload_to="docs/category/%Y/%m", storage=ImageStorage(),
                              help_text="图片路径", blank=True, null=True)
    description = models.CharField(verbose_name="描述", max_length=1024, blank=True, null=True)
    parent = models.ForeignKey(verbose_name="父级分类", related_name="subs",
                               blank=True, null=True, to="self", on_delete=models.CASCADE)
    # level级别 和 顺序 order
    level = models.SmallIntegerField(verbose_name="级别", blank=True, default=1)
    order = models.SmallIntegerField(verbose_name="顺序", blank=True, default=1)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    is_deleted = models.BooleanField(verbose_name="是否删除", blank=True, default=False)

    def __str__(self):
        return "{}:{}".format(self.code, self.name)

    def save(self, *args, **kwargs):
        if not self.id and self.image:
            self.file = self.resize_image(self.image)
        super().save(*args, **kwargs)

    def delete(self):
        if not self.is_deleted:
            self.is_deleted = True
            self.save()
        return

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


