# -*- coding:utf-8 -*-

from django.urls import path
from docs.views.article import (
    ArticleCreateApiView,
    ArticleListApiView,
    ArticleListAllApiView,
    ArticleDetailApiView,
    ArticleInfoListAllApiView,
    ArticleInfoValueApiView,
    ArticleDiscussionListApiView
)

urlpatterns = [
    # 前缀：/api/v1/docs/article/
    path('create', ArticleCreateApiView.as_view(), name="create"),
    path('list', ArticleListApiView.as_view(), name="list"),
    path('all', ArticleListAllApiView.as_view(), name="all"),
    path('<int:pk>', ArticleDetailApiView.as_view(), name="detail"),
    path('<int:article_id>/discussions', ArticleDiscussionListApiView.as_view(), name="discussion_list"),
    path('<int:article_id>/infos', ArticleInfoListAllApiView.as_view(), name="infos"),
    path('<int:article_id>/infovalues', ArticleInfoValueApiView.as_view(), name="infovalues"),
]
