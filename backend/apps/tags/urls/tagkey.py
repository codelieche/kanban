# -*- coding:utf-8 -*-
from django.urls import path

from tags.views.tagkey import (
    TagKeyCreateApiView,
    TagKeyListApiView,
    TagKeyListAllApiView,
    TagKeyDetailApiView,
    TagValuesListApiView
)

urlpatterns = [
    # 前缀：/api/v1/tags/key/
    path('create', TagKeyCreateApiView.as_view(), name="create"),
    path('list', TagKeyListApiView.as_view(), name="list"),
    path('all', TagKeyListAllApiView.as_view(), name="all"),
    path('<int:pk>', TagKeyDetailApiView.as_view(), name="detail"),
    path('<str:key>', TagKeyDetailApiView.as_view(lookup_field="key"), name="detail2"),
    # 获取标签key对应的所有值
    path('<int:pk>/values', TagValuesListApiView.as_view(), name="values"),
    path('<str:key>/values', TagValuesListApiView.as_view(lookup_field="key"), name="values2"),

]
