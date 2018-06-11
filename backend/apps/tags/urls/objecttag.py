# -*- coding:utf-8 -*-
from django.urls import path

from tags.views.objecttag import (
    ObjectTagCreateApiView,
    ObjectTagListApiView
)

urlpatterns = [
    # 前缀：/api/v1/tags/objecttag/
    path('create', ObjectTagCreateApiView.as_view(), name="create"),
    path('list', ObjectTagListApiView.as_view(), name="list"),
]
