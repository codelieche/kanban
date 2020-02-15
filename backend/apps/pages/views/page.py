"""
页面相关的视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http.response import JsonResponse

from pages.models.page import Page
from pages.models.info import Info
from pages.serializers.page import (
    PageModelSerializer,
    PageWithInfovaluesListSerializer
)
from pages.serializers.info import InfoModelSerializer


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
    
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title")
    filter_fields = ("parent", "parent_id")
    ordering_fields = ("id", "parent_id", "parent", "order")
    ordering = ("parent", "order")

    def get_serializer_class(self):
        request = self.request
        if request.query_params.get("type") == "infovalues":
            return PageWithInfovaluesListSerializer
        else:
            return PageModelSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, args, kwargs)


class PageDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    创建详情的API
    """
    queryset = Page.objects.all()
    serializer_class = PageModelSerializer
    permission_classes = (IsAuthenticated,)


class PageInfoListAllApiView(generics.ListAPIView):
    """
    获取页面的所有属性列表
    """
    serializer_class = InfoModelSerializer
    permissions_classes = (IsAuthenticated, )
    pagination_class = None

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_fields = ("category", "category__element", "is_active")
    search_fields = ("name", "category__name")
    ordering_fields = ("id", "category", "order", "is_active")
    ordering = ("order", "id")

    def get_queryset(self):
        # print(self.args, self.kwargs)
        
        page_id = self.kwargs.get("page_id", 0)
        return Info.objects.filter(page_id=page_id)


class PageInfoValueApiView(APIView):
    """获取page的属性值"""

    permission_classes = (IsAuthenticated,)

    def get(self, request, page_id):
        # 获取page的id
        # page_id = self.kwargs.get("page_id", 0)
        # print(self, page_id)
        page = get_object_or_404(Page, id=page_id)

        infovalues = page.infovalues
        # print(page, infovalues)
        return JsonResponse(data=infovalues)


