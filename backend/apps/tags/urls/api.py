# -*- coding:utf-8 -*-
from django.urls import path, include

urlpatterns = [
    # 前缀：/api/v1/tags/
    # tag api
    path('tag/', include(arg=("tags.urls.tag", "tags"), namespace="tag")),
    # tag value api
    path('tagvalue/', include(arg=("tags.urls.tagvalue", "tags"), namespace="tagvalue")),
    # Object Tag Api
    path('objecttag/', include(arg=("tags.urls.objecttag", "tags"), namespace="objecttag")),
]
