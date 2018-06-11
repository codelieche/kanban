# -*- coding:utf-8 -*-
"""
标签值相关视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from tags.models import TagValue
from tags.serializers.tagvalue import TagValueModelSerializer


class TagValueListApiView(generics.ListAPIView):
    """
    TagValue List Api
    """
    queryset = TagValue.objects.all()
    serializer_class = TagValueModelSerializer
    permission_classes = (IsAuthenticated,)

    # 搜索和过滤
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_fields = ("tag", "tag__tag")
    search_fields = ("tag__tag", "value")
    ordering_fields = ("id", "tag")
    ordering = ("id",)
