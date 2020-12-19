# -*- coding:utf-8 -*-
import os
import time

import qiniu
from qiniu import BucketManager

QINIU_ACCESS_KEY = os.environ.get("QINIU_ACCESS_KEY", None)
QINIU_SECRET_KEY = os.environ.get("QINIU_SECRET_KEY", None)


def copy_source_to_target(source, target):
    # 列出source中的所有文件
    # 构建权限对象
    q = qiniu.Auth(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
    # 生成上传的token
    token = q.upload_token(source, None, 3600)

    # 初始化BucketManager
    bucket = BucketManager(q)
    marker = None
    delimiter = None
    limit = 200
    et, eof, info = bucket.list(source, "", marker, limit, delimiter)
    # print(info)

    for item in et["items"]:
        ret, info = bucket.copy(source, item["key"], target, item["key"])
        print(item["key"], info.status_code)


if __name__ == "__main__":
    copy_source_to_target("source-test", "target-test")

