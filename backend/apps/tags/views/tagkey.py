# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from tags.models import TagKey, TagValue
from tags.serializers.tagkey import TagKeyModelSerializer
from tags.serializers.tagvalue import TagValueModelSerializer


class TagKeyCreateApiView(generics.CreateAPIView):
    """
    创建标签
    """
    queryset = TagKey.objects.all()
    serializer_class = TagKeyModelSerializer
    permission_classes = (IsAuthenticated,)


class TagKeyListApiView(generics.ListAPIView):
    """
    标签列表api
    """
    queryset = TagKey.objects.filter(is_deleted=False)
    serializer_class = TagKeyModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("key", "name", "description")
    filter_fields = ("is_hot", "is_deleted")
    ordering_fields = ("id", "is_hot", "is_deleted")
    ordering = ("id",)


class TagKeyListAllApiView(generics.ListAPIView):
    """
    标签列表All api
    """
    queryset = TagKey.objects.filter(is_deleted=False)
    serializer_class = TagKeyModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("key", "name", "description")
    filter_fields = ("is_hot", "is_deleted")
    ordering_fields = ("id", "is_hot", "is_deleted")
    ordering = ("id",)

    pagination_class = None


class TagKeyDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    标签详情api
    """
    queryset = TagKey.objects.all()
    serializer_class = TagKeyModelSerializer
    permission_classes = (IsAuthenticated, )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response(status=HTTP_204_NO_CONTENT)


class TagValuesListApiView(generics.ListAPIView):
    """
    标签的值列表api
    """
    serializer_class = TagValueModelSerializer
    permission_classes = (IsAuthenticated,)

    pagination_class = None

    def get_queryset(self):
        tag_key = TagKey.objects.filter(**self.kwargs).first()
        queryset = TagValue.objects.filter(key=tag_key)
        return queryset
