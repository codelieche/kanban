# -*- coding:utf-8 -*-
"""
标签值相关视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
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
    filter_fields = ("key", "key__key", "is_hot", "is_deleted")
    search_fields = ("key__key", "value")
    ordering_fields = ("id", "key")
    ordering = ("id",)


class TagValueDetailApiView(generics.RetrieveUpdateAPIView):
    """
    TagValue Detail Api 
    Method：Get、Put、Patch
    """
    queryset = TagValue.objects.all()
    serializer_class = TagValueModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissions)
