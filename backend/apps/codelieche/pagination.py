# -*- coding:utf-8 -*-
"""
分页器相关的工具
"""

from rest_framework.pagination import PageNumberPagination


class SelfPagination(PageNumberPagination):
    """
    Rest FrameWork 自定义分页器类
    在generics.ListAPIView中可以设置:pagination_class = SelfPagination
    或者在settings.py中指定REST_FRAMEWORK.DEFAULT_PAGINATION_CLASS = 'utils.paginations.SelfPagination'
    另外也可以设置为：'rest_framework.pagination.LimitOffsetPagination'这个类
    加了这个ListView返回的json数据有：count、next、previous、results字段
    """
    page_size = 10
    max_page_size = 1000
    page_size_query_param = 'page_size'

    def paginate_queryset(self, queryset, request, view=None):
        # UnorderedObjectListWarning 出现警告，添加此方法
        # 由于传的QuerySet没有排序
        self.django_paginator_class._check_object_list_is_ordered = lambda x: None
        return super().paginate_queryset(queryset, request, view=view)
