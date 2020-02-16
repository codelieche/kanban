# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.infovalue import (
    # InfoValueCreateApiView,
    InfoValueAddApiView,
    InfoValueListApiView,
    InfoValueDetailApiView,
    InfoValueListAllArticleApiView,
)

urlpatterns = [
    # 前缀：/api/v1/docs/infovalue/

    # 信息值
    # path("create", InfoValueCreateApiView.as_view(), name="create"),
    path("add", InfoValueAddApiView.as_view(), name="add"),
    path("list", InfoValueListApiView.as_view(), name="list"),
    path("<int:pk>/<int:article_id>", InfoValueDetailApiView.as_view(), name="delete_article_infovalue"),
    path("<int:pk>", InfoValueDetailApiView.as_view(), name="detail"),
    path("<int:pk>/articles", InfoValueListAllArticleApiView.as_view(), name="articles"),
]
