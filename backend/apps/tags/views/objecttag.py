# -*- coding:utf-8 -*-
"""
对象标签相关视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from tags.models import TagKey, TagValue, ObjectTag
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
            key = validated_data.get("key")
            if not key:
                return Response("key不能为空")
            key = key.strip()
            tag_key, created = TagKey.objects.get_or_create(key=key)
            value = validated_data.get('value')
            if not value:
                return Response("value不能为空")
            value = value.strip()  # 去掉左右的空格
            tagvalue, created = TagValue.objects.get_or_create(key=tag_key, value=value)
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
            # 设置创建标签的user
            instance.user = request.user
            if not created and instance.is_deleted:
                instance.is_deleted = False
                instance.save()
            else:
                # 设置一下时间
                instance.time_added = timezone.now()
                instance.save()
            # 返回结果
            validated_data["id"] = instance.id
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
    filter_fields = ("app_label", "model", "object_id", "tagvalue", 
                     "tagvalue__key_id", "tagvalue__value", "tagvalue__key__key",)
    search_fields = ("tagvalue_value", "tagvalue__key__key")
    ordering_fields = ("id", "tagvalue", "object_id")
    ordering = ("-id",)


class ObjectTagValueListApiView(generics.ListAPIView):
    """
    列出对象的TagValue列表
    """
    serializer_class = ObjectTagValueSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = ObjectTag.objects.filter(**self.kwargs).order_by("id")
        return queryset


class ObjectTagDetailApiView(generics.RetrieveDestroyAPIView):
    """
    对象标签的详情
    """
    queryset = ObjectTag.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ObjectTagModelSerializer
