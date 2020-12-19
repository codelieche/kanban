# -*- coding:utf-8 -*-
from django.urls import path

from storage.views.file import (
    FileUploadApiView,
    FileListApiView,
    FileDetailApiView,
    FileDetailObjectView,
    ObjectRetrieveApiView
)

urlpatterns = [
    # 前缀：/api/v1/storage/file/
    path('upload', FileUploadApiView.as_view(), name="upload"),
    path("list", FileListApiView.as_view(), name="list"),
    path("<int:pk>", FileDetailApiView.as_view(), name="detail"),
    path("<int:pk>/object", FileDetailObjectView.as_view(), name="object"),
    path("<str:category>/<int:pk>", ObjectRetrieveApiView.as_view(), name="object2"),
]
