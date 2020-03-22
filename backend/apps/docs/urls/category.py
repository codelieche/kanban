# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.category import (
    CategoryCreateApiView,
    CategoryListApiView,
    CategoryListAllApiView,
    CategoryDetailApiView,
    CategoryArticlesListApiView,
    CategoryUserPermissionApiView
)

urlpatterns = [
    # 前缀：/api/v1/docs/category/
    path('create', CategoryCreateApiView.as_view(), name="create"),
    path('list', CategoryListApiView.as_view(), name="list"),
    path('all', CategoryListAllApiView.as_view(), name="all"),
    path('<int:pk>', CategoryDetailApiView.as_view(), name="detail"),
    path('<int:pk>/articles', CategoryArticlesListApiView.as_view(), name="articles"),
    path('<int:pk>/permissions', CategoryUserPermissionApiView.as_view(), name="permissions"),
    path('<str:code>', CategoryDetailApiView.as_view(lookup_field="code"), name="detail2"),
]
