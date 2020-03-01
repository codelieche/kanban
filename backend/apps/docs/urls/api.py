# -*- coding:utf-8 -*-

from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/docs/
    # Articles Article Api
    path('category/', include(arg=('docs.urls.category', 'docs'), namespace='category')),
    path('article/', include(arg=('docs.urls.article', 'docs'), namespace='article')),
    path('info/', include(arg=('docs.urls.info', 'docs'), namespace='info')),
    path('infovalue/', include(arg=('docs.urls.infovalue', 'docs'), namespace='infovalue')),
    path('image/', include(arg=('docs.urls.image', "docs"), namespace="image")),
]