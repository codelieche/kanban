# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.group import (
    GroupCreateApiView,
    GroupListApiView,
    GroupListAllApiView,
    GroupDetailApiView,
    GroupArticlesListApiView,
    GroupUserPermissionApiView
)

urlpatterns = [
    # 前缀：/api/v1/docs/group/
    path('create', GroupCreateApiView.as_view(), name="create"),
    path('list', GroupListApiView.as_view(), name="list"),
    path('all', GroupListAllApiView.as_view(), name="all"),
    path('<int:pk>', GroupDetailApiView.as_view(), name="detail"),
    path('<int:pk>/articles', GroupArticlesListApiView.as_view(), name="articles"),
    path('<int:pk>/permissions', GroupUserPermissionApiView.as_view(), name="permissions"),
    path('<str:code>', GroupDetailApiView.as_view(lookup_field="code"), name="detail2"),
]
