# -*- coding:utf-8 -*-

from django.urls import path
from docs.views.article import (
    ArticleCreateApiView,
    ArticleListApiView,
    ArticleDetailApiView,
    ArticleInfoListAllApiView,
    ArticleInfoValueApiView,
)

urlpatterns = [
    # 前缀：/api/v1/docs/article/
    path('create', ArticleCreateApiView.as_view(), name="create"),
    path('list', ArticleListApiView.as_view(), name="list"),
    path('<int:pk>', ArticleDetailApiView.as_view(), name="detail"),
    path('<int:article_id>/infos', ArticleInfoListAllApiView.as_view(), name="infos"),
    path('<int:article_id>/infovalues', ArticleInfoValueApiView.as_view(), name="infovalues"),
]
