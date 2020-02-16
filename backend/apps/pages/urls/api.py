# -*- coding:utf-8 -*-

from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/pages/
    # Pages Page Api
    path('category/', include(arg=('pages.urls.category', 'pages'), namespace='category')),
    path('page/', include(arg=('pages.urls.page', 'pages'), namespace='page')),
    path('info/', include(arg=('pages.urls.info', 'pages'), namespace='info')),
    path('infovalue/', include(arg=('pages.urls.infovalue', 'pages'), namespace='infovalue')),
]