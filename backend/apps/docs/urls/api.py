# -*- coding:utf-8 -*-

from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/docs/
    # Articles Article Api
    path('group/', include(arg=('docs.urls.group', 'docs'), namespace='group')),
    path('groupuser/', include(arg=('docs.urls.group_user', 'docs'), namespace='group_user')),
    path('article/', include(arg=('docs.urls.article', 'docs'), namespace='article')),
    path('discussion/', include(arg=('docs.urls.discussion', 'docs'), namespace='discussion')),
    path('info/', include(arg=('docs.urls.info', 'docs'), namespace='info')),
    path('infovalue/', include(arg=('docs.urls.infovalue', 'docs'), namespace='infovalue')),
    path('image/', include(arg=('docs.urls.image', "docs"), namespace="image")),
]