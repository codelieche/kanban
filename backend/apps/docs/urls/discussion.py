"""
讨论相关的路由
"""
from django.urls import path

from docs.views.discussion import (
    DiscussionCreateApiView,
    DiscussionListApiView,
    DiscussionDetailApiView
)

urlpatterns = [
    # 前缀：/api/v1/docs/discussion
    path("create", DiscussionCreateApiView.as_view(), name="create"),
    path("list", DiscussionListApiView.as_view(), name="list"),
    path("<int:pk>", DiscussionDetailApiView.as_view(), name="detail"),
]
