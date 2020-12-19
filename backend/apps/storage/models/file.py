# -*- coding:utf-8 -*-
import sys
from io import BytesIO
import json

from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as PImage, ExifTags

from utils.store import FileStorage

from account.models import User
from storage.models.account import Account
from storage.tools.qiniu import QiniuApi


class File(models.Model):
    """
    存储的文件对象
    """
    CATEGORY_CHOICES = (
        ('file', '文件'),
        ('image', '图片'),
        ('video', '视频'),
        ('docs', '文档'),
        ('code', '代码'),
        ('secret', '加密文件'),
        ('other', '其它'),
    )
    user = models.ForeignKey(verbose_name="上传用户", blank=True, to=User,
                             on_delete=models.SET_NULL, null=True)
    account = models.ForeignKey(verbose_name="存储账户", to=Account, on_delete=models.SET_NULL,
                                blank=True, null=True)
    filename = models.CharField(verbose_name="文件名", max_length=200, blank=True)
    category = models.CharField(verbose_name="文件类型", max_length=10, default="file", blank=True)
    file = models.FileField(upload_to="files/%Y/%m", help_text="上传文件",
                            storage=FileStorage())
    # 以后会用到
    hashcode = models.CharField(verbose_name="文件HASH", blank=True, null=True, max_length=256)
    # 云平台存储对应的文件的路径，对象key
    # 云平台的url通过，account.domain/objectkey组合
    # cloud = models.CharField(verbose_name="对象Url", max_length=200, blank=True, null=True)
    # 非超级用户的，文件存储的key我们给其加个userid
    objectkey = models.CharField(verbose_name="对象Key", max_length=200, blank=True, null=True)
    # 图片的宽和高: 第一次创建的时候记录，同时更新的时候也需要记录
    # width = models.IntegerField(verbose_name="宽", blank=True, default=0, null=True)
    # height = models.IntegerField(verbose_name="高", blank=True, default=0, null=True)
    # 图片有宽、高相关的属性，可保存到info中
    info = models.CharField(verbose_name="其它信息", blank=True, null=True, max_length=512)
    # 图片大小
    size = models.BigIntegerField(verbose_name="大小", blank=True, default=0, null=True)
    time_added = models.DateTimeField(verbose_name="上传时间", blank=True, auto_now_add=True)
    time_updated = models.DateTimeField(verbose_name="更新时间", blank=True, auto_now=True)
    is_active = models.BooleanField(verbose_name="是否有效", blank=True, default=True)
    description = models.CharField(verbose_name="描述", max_length=256, blank=True, null=True)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):

        # 没有id，就表示是第一次上传文件
        if not self.id and self.file:
            self.is_active = True
            # 如果是图片就需要修改一下尺寸
            if self.category == "image":
                try:
                    self.file = self.resize_image(self.file)
                except Exception as e:
                    print(str(e))

            if not self.filename:
                self.filename = self.file.name

            self.size = self.file.size
            super().save(force_insert=force_insert, force_update=force_update,
                         using=using, update_fields=update_fields)

            # 这里开始处理把文件上传到七牛云
            # 先简单处理
            storage_account = Account.objects.filter(user=self.user).first()

            if storage_account:
                if storage_account.platform == "qiniu":
                    # 把文件上传到七牛云
                    # 这里开始把图片上传到七牛云中
                    data = self.file.read()
                    filename_key = self.file.url
                    filename_key = filename_key.replace("/storage/files/", "files/{}/{}/".format(self.user_id, self.category))

                    try:
                        api = QiniuApi(storage_account.access_key, storage_account.secret_key, storage_account.bucket)
                        results = api.upload_file(filename_key, data)
                        # 获取上传的结果
                        if results:
                            result, info = results
                            if result and "key" in result:
                                # print("上传成功:", result["key"])
                                # qiniu_url = "http://{}/{}".format(settings.QINIU_BUCKET_DOMAIN, filename_key)
                                # qiniu_url = "http://{}/{}".format(storage_account.domain, result["key"])
                                # print(qiniu_url)
                                # 保存存储的文件
                                self.account = storage_account
                                self.objectkey = result["key"]
                                self.save()
                            else:
                                print("上传失败：", info)
                    except Exception as e:
                        print("上传图片到qiniu失败：", str(e))
        else:
            # 修改操作
            super().save(force_insert=force_insert, force_update=force_update,
                         using=using, update_fields=update_fields)

    def __str__(self):
        return self.filename

    def delete(self):
        if self.is_active:
            self.is_active = False
            self.save()
        return

    @property
    def cloud_url(self):
        """获取云平台的地址"""
        if self.account and self.account.domain and self.objectkey:
            return "{}://{}/{}".format("https" if self.account.is_https else "http", self.account.domain, self.objectkey)
        else:
            return ""

    def resize_image(self, image_file):
        """
        对图片大小进行缩放
        :param image_file: 图片对象
        :return:
        """
        if image_file.file.content_type != "image/jpeg" and image_file.size < 6 * 1024:
            try:
                # 图片信息宽和高
                info = {}
                image_tmp = PImage.open(image_file)
                # 修改图片的尺寸和大小信息
                w, h = image_tmp.size
                info["width"] = w
                info["height"] = h
                self.info = json.dumps(info)
            except Exception as e:
                print(str(e))
            return image_file

        # data = image_file.file.read()
        if image_file.file.content_type == "image/gif":
            return image_file

        # 如果未传递filename，那么就实用上传图片的名字
        if not self.filename and image_file.file.name:
            self.filename = image_file.file.name

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
        try:
            # 图片信息
            info = {}
            # 修改图片的尺寸和大小信息
            info["width"] = image_resize.width
            info["height"] = image_resize.height
            self.info = json.dumps(info)
        except Exception as e:
            print(str(e))
        try:
            image_resize.save(output_io_stream, format='JPEG', quality=80)
        except OSError as e:
            if str(e).find("RGBA") > 0:
                # cannot write mode RGBA as JPEG
                image_resize = image_resize.convert('RGB')
                image_resize.save(output_io_stream, format='JPEG', quality=80)
            else:
                print(e)
                # 返回原来的图片吧
                return image_file

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
        verbose_name = "文件"
        verbose_name_plural = verbose_name
