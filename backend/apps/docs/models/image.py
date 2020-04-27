"""
文档图片
"""
import sys
from io import BytesIO

from django.db import models
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as PImage, ExifTags

from utils.store import ImageStorage, upload_file_to_qiniu
from account.models import User


class Image(models.Model):
    """
    图片
    """
    filename = models.CharField(verbose_name="文件名", max_length=100, blank=True)
    user = models.ForeignKey(verbose_name="上传用户", blank=True, to=User,
                             on_delete=models.SET_NULL, null=True)
    file = models.ImageField(upload_to="docs/images/%Y/%m", storage=ImageStorage(), help_text="上传图片")
    qiniu = models.CharField(verbose_name="七牛云地址", max_length=200, blank=True, null=True)
    time_added = models.DateTimeField(verbose_name="上传事件", blank=True, auto_now_add=True)
    is_active = models.BooleanField(verbose_name="是否有效", blank=True, default=True)

    def save(self, *args, **kwargs):
        # 没有id，就表示是第一次上传文件
        if not self.id and self.file:
            self.is_active = True
            self.file = self.resize_image(self.file)
            if not self.filename:
                self.filename = self.file.name
            super().save(*args, **kwargs)

            # 这里开始把图片上传到七牛云中
            data = self.file.read()
            filename_key = self.file.url
            filename_key = filename_key.replace("/media/docs/", "docs/")
            # print(filename_key, len(data))
            try:
                results = upload_file_to_qiniu(filename_key, data)
                if results:
                    result, info = results
                    # 获取上传的结果
                    if result and "key" in result:
                        # print("上传成功:", result["key"])
                        qiniu_url = "http://{}/{}".format(settings.QINIU_BUCKET_DOMAIN, filename_key)
                        self.qiniu = qiniu_url
                        self.save()
                    else:
                        print("上传失败：", info)
            except Exception as e:
                print("上传图片到qiniu失败：", str(e))
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return self.filename

    def delete(self):
        if self.is_active:
            self.is_active = False
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
        
        data = image_file.file.read()

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
        verbose_name = "图片"
        verbose_name_plural = verbose_name
