"""
图片相关的路由
"""
from django.urls import path

from docs.views.image import (
    ImageUploadApiView,
    ImageListApiView,
    ImageDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/docs/
    path("upload", ImageUploadApiView.as_view(), name="upload"),
    path("list", ImageListApiView.as_view(), name="list"),
    path("<int:pk>", ImageDetailApiView.as_view(), name="detail"),
]
