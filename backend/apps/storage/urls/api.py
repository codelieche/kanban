# -*- coding:utf-8 -*-
from django.urls import path, include
from rest_framework import routers

from storage.views.account import AccountApiModelViewSet

router = routers.DefaultRouter()
router.register('account', AccountApiModelViewSet)

urlpatterns = [
    # 前缀：/api/v1/storage/
    path('file/', include(arg=('storage.urls.file', 'storage'), namespace='file')),
    path('', include(router.urls), name="storage"),
]
