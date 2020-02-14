"""
页面相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from pages.models.page import Page
from pages.models.info import Info
from pages.serializers.page import PageModelSerializer
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
