# -*- coding:utf-8 -*-
from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/storage/
    path('file/', include(arg=('storage.urls.file', 'storage'), namespace='file')),
]