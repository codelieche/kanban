# -*- coding:utf-8 -*-
"""
七牛处理函数
"""
from django.conf import settings
import qiniu


class QiniuApi:
    def __init__(self, acces_key, secret_key, bucket):
        # 1-1: 构建权限对象
        self.q = qiniu.Auth(acces_key, secret_key)
        # 1-2: 生成token: 300秒有效
        self.token = self.q.upload_token(bucket, None, 300)

    def upload_file(self, key_path, file_data):
        try:
            # 上传的文件已经存在了，或者token过期了，都是会报错的
            result, info = qiniu.put_data(self.token, key_path, file_data)
            # 提取文件的key，请根据info/result自行处理
            return (result, info)
        except Exception as e:
            print(e)
            return None

    def private_download_url(self, base_url, expires=3600):
        # base_url = domain + / + objectkey
        return self.q.private_download_url(base_url, expires=expires)


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
    if not settings.QINIU_UPLOAD_TOOGLE:
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
