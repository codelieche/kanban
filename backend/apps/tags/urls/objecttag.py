# -*- coding:utf-8 -*-
from django.urls import path

from tags.views.objecttag import (
    ObjectTagCreateApiView,
    ObjectTagListApiView,
    ObjectTagDetailApiView
)

urlpatterns = [
    # 前缀：/api/v1/tags/objecttag/
    path('create', ObjectTagCreateApiView.as_view(), name="create"),
    path('list', ObjectTagListApiView.as_view(), name="list"),
    path("<int:pk>", ObjectTagDetailApiView.as_view(), name="detail")
]
