# -*- coding:utf-8 -*-
"""
文件上传相关的工具函数
"""
import os
import time
import random

# from PIL import Image
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import qiniu


class ImageStorage(FileSystemStorage):
    """
    图片上传
    图片上传的时候自动修改下文件名字
    """

    def __init__(self, location=settings.MEDIA_ROOT, base_url=settings.MEDIA_URL):
        # 初始化ImageStorage
        super(ImageStorage, self).__init__(location, base_url)

    def _save(self, name, content):
        """
        拓展_save方法
        :param name: 上传的文件名
        :param content: 内容
        :return:
        """
        # 先获取文件的拓展名
        ext = os.path.splitext(name)[1]
        # 文件目录
        d = os.path.dirname(name)
        # 定义文件名：年/月/时分秒随机数
        # filename = time.strftime('%Y%m%d%H%M%S')
        filename = time.strftime('%d%H%M%S')
        # 如果并发人数大，那么这个重命名需要调整
        filename = '{}_{}'.format(filename, random.randint(0, 100))
        # 重写合成文件的名字,注意别漏了ext
        name_new = os.path.join(d, filename + ext)
        # 设置保存的图片的权限
        self.file_permissions_mode = 0o644
        # 调用父类的方法
        return super(ImageStorage, self)._save(name=name_new, content=content)


class FileStorage(FileSystemStorage):
    """
    文件上传
    文件上传的时候自动修改下文件名字
    """

    def __init__(self, location=settings.FILE_STORAGE_ROOT, base_url=settings.FILE_STORAGE_URL):
        # 初始化ImageStorage
        super().__init__(location, base_url)

    def _save(self, name, content):
        """
        拓展_save方法
        :param name: 上传的文件名
        :param content: 内容
        :return:
        """
        # 先获取文件的拓展名
        ext = os.path.splitext(name)[1]
        # 文件目录
        d = os.path.dirname(name)
        # 定义文件名：年/月/时分秒随机数
        # filename = time.strftime('%Y%m%d%H%M%S')
        filename = time.strftime('%d%H%M%S')
        # 如果并发人数大，那么这个重命名需要调整
        filename = '{}_{}'.format(filename, random.randint(0, 100))
        # 重写合成文件的名字,注意别漏了ext
        name_new = os.path.join(d, filename + ext)
        # 设置保存的图片的权限
        self.file_permissions_mode = 0o644
        # 调用父类的方法
        return super()._save(name=name_new, content=content)


def file_upload_to(instance, filename):
    """
    文件上传相对路径
    :param instance: 实例
    :param filename: 文件名
    :return: 上传的文件路径
    """
    # 传过来的实力，需要有个user_id的值，用户ID
    print(instance.user_id)
    name = 'file/{}/{}_{}'.format(time.strftime('%Y/%m'), instance.user_id, filename)
    return name


# PRIVATE_MEDIA_ROOT = getattr(settings, 'PRIVATE_MEDIA_ROOT',
#                              os.path.join(settings.BASE_DIR, '../private_media'))
# # 判断目录是否存在，如果不存在创建
# if not os.path.exists(PRIVATE_MEDIA_ROOT):
#     os.mkdir(PRIVATE_MEDIA_ROOT)
#
#
# class PrivateFileStorage(FileSystemStorage):
#     """
#     文件上传，不是要用media，使用私有文件系统
#     图片上传的时候自动修改下文件名字
#     """
#
#     def __init__(self, location=PRIVATE_MEDIA_ROOT, base_url='/files'):
#         # 初始化ImageStorage
#         super().__init__(location, base_url)
#
#     def _save(self, name, content):
#         """
#         拓展_save方法
#         :param name: 上传的文件名
#         :param content: 内容
#         :return:
#         """
#         # 先获取文件的拓展名
#         ext = os.path.splitext(name)[1]
#         # 文件目录
#         d = os.path.dirname(name)
#         # 定义文件名：年/月/时分秒随机数
#         # filename = time.strftime('%Y%m%d%H%M%S')
#         filename = time.strftime('%d%H%M%S')
#         # 如果并发人数大，那么这个重命名需要调整
#         filename = '{}_{}'.format(filename, random.randint(0, 100))
#         # 重写合成文件的名字,注意别漏了ext
#         name_new = os.path.join(d, filename + ext)
#         # 调用父类的方法
#         return super()._save(name=name_new, content=content)


def upload_file_to_qiniu(key_path, file_data):
    """
    上传文件到七牛
    @params: key_path: 上传到七牛云对象存储的key
    @params: file_data: 上传的文件数据
    """
    # 第1步：检查配置:所有值存在才处理上传操作
    if not all([settings.QINIU_ACCESS_KEY, settings.QINIU_SECRET_KEY, 
                settings.QINIU_BUCKET, settings.QINIU_BUCKET_DOMAIN]):
        return None
    
    # 判断是否需要上传
    if not settings.QINIU_UPLOAD_TOOGLE or settings.QINIU_UPLOAD_TOOGLE == '0' \
       or settings.QINIU_UPLOAD_TOOGLE == 'false':
        return None

    # 第2步：获取token
    # 2-1: 构建权限对象
    q = qiniu.Auth(settings.QINIU_ACCESS_KEY, settings.QINIU_SECRET_KEY)
    # 2-2: 生成token: 300秒有效
    token = q.upload_token(settings.QINIU_BUCKET, None, 300)

    # 第3步：上传文件到七牛
    # 判断是否需要加个前缀
    qiniu_key_prefix = settings.QINIU_KEY_PREFIX
    if qiniu_key_prefix:
        if key_path.startswith("/"):
            key_path = "{}{}".format(qiniu_key_prefix, key_path)
        else:
            key_path = "{}/{}".format(qiniu_key_prefix, key_path)
    try:
        # 上传的文件已经存在了，或者token过期了，都是会报错的
        result, info = qiniu.put_data(token, key_path, file_data)
        # 提取文件的key，请根据info/result自行处理
        return (result, info)

    except Exception as e:
        print(e)
        return None
