"""
页面相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from pages.models.page import Page
from pages.serializers.page import PageModelSerializer


class PageCreateApiView(generics.CreateAPIView):
    """
    创建页面的API
    """
    queryset = Page.objects.all()
    serializer_class = PageModelSerializer
    permission_classes = (IsAuthenticated,)


class PageListApiView(generics.ListAPIView):
    """
    创建列表的API
    """
    queryset = Page.objects.all()
    serializer_class = PageModelSerializer
    permission_classes = (IsAuthenticated,)


class PageDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    创建详情的API
    """
    queryset = Page.objects.all()
    serializer_class = PageModelSerializer
    permission_classes = (IsAuthenticated,)