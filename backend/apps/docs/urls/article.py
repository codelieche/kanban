# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.article import (
    ArticleCreateApiView,
    ArticleListApiView,
    ArticleDetailApiView
)

urlpatterns = [
    # 前缀：/api/v1/docs/article/
    path('create', ArticleCreateApiView.as_view(), name="create"),
    path('list', ArticleListApiView.as_view(), name="list"),
    path('<int:pk>', ArticleDetailApiView.as_view(), name="detail"),
]
