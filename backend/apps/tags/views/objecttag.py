# -*- coding:utf-8 -*-
"""
对象标签相关视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from tags.models import Tag, TagValue, ObjectTag
from tags.serializers.objecttag import (
    ObjectTagCreateSerializer,
    ObjectTagModelSerializer,
    ObjectTagValueSerializer
)


class ObjectTagCreateApiView(APIView):
    """
    创建对象标签api
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ObjectTagCreateSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            tag = validated_data.get("tag")
            tag, created = Tag.objects.get_or_create(tag=tag)
            value = validated_data.get('value')
            tagvalue, created = TagValue.objects.get_or_create(tag=tag, value=value)
            # if not created and tagvalue.is_deleted:
            #     tagvalue.is_deleted = False
            #     tagvalue.save()

            # 判断model是否存在【后续优化】
            app_label = validated_data.get('app_label')
            model = validated_data.get('model')
            object_id = validated_data.get("object_id")
            instance, created = ObjectTag.objects.get_or_create(tagvalue=tagvalue,
                                                                app_label=app_label,
                                                                model=model,
                                                                object_id=object_id)
            if not created and instance.is_deleted:
                instance.is_deleted = False
                instance.save()
            # 返回结果
            # serializer = ObjectTagModelSerializer(data=instance)
            # serializer.is_valid()
            return Response(validated_data)
        else:
            return Response(data=serializer.errors, status=400)


class ObjectTagListApiView(generics.ListAPIView):
    """
    对象标签list api
    """
    queryset = ObjectTag.objects.filter(is_deleted=False).order_by("id")
    serializer_class = ObjectTagModelSerializer
    permission_classes = (IsAuthenticated,)

    # 搜索过滤
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_fields = ("app_label", "model", "object_id", "tagvalue")
    search_fields = ("tagvalue_value",)
    ordering_fields = ("id", "tagvalue")
    ordering = ("id",)


class ObjectTagValueListApiView(generics.ListAPIView):
    """
    列出对象的TagValue列表
    """
    serializer_class = ObjectTagValueSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = ObjectTag.objects.filter(**self.kwargs).order_by("id")
        return queryset
