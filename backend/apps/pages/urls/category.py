# -*- coding:utf-8 -*-

from django.urls import path

from pages.views.category import (
    CategoryCreateApiView,
    CategoryListApiView,
    CategoryListAllApiView,
    CategoryDetailApiView
)

urlpatterns = [
    # 前缀：/api/v1/docs/category/
    path('create', CategoryCreateApiView.as_view(), name="create"),
    path('list', CategoryListApiView.as_view(), name="list"),
    path('all', CategoryListAllApiView.as_view(), name="all"),
    path('<int:pk>', CategoryDetailApiView.as_view(), name="detail"),
    path('<str:code>', CategoryDetailApiView.as_view(lookup_field="code"), name="detail2"),
]
