"""
页面信息相关的视图函数
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from pages.models.info import InfoCategory, Info, InfoValue
from pages.serializers.info import (
    InfoCategoryModelSerializer,
    InfoModelSerializer,
    InfoValueModelSerializer
)


class InfoCategoryListApiView(generics.ListAPIView):
    """
    Info Category List Api View
    """
    queryset = InfoCategory.objects.filter(is_active=True).order_by("order")
    serializer_class = InfoCategoryModelSerializer
    permission_classes = (IsAuthenticated, )


class InfoCreateApiView(generics.CreateAPIView):
    """
    Info Create Api View
    """
    queryset = Info.objects.all()
    serializer_class = InfoModelSerializer
    permission_classes = (IsAuthenticated, )


class InfoListApiView(generics.ListAPIView):
    """
    Info List Api View
    """
    queryset = Info.objects.all()
    serializer_class = InfoModelSerializer
    permission_classes = (IsAuthenticated, )

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name",)
    # 注意列表页是根据page字段来分页的
    filter_fields = ("page_id", "category")
    ordering_fields = ("id", "page_id", "category", "order")
    ordering = ("-id", )



class InfoDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Info Detail Api View
    """
    queryset = Info.objects.all()
    serializer_class = InfoModelSerializer
    permission_classes = (IsAuthenticated, )


class InfoAllValueListApiView(generics.ListAPIView):
    """
    获取属性的所有值的列表
    不带分页功能
    """
    
    serializer_class = InfoValueModelSerializer
    permission_classes = (IsAuthenticated, )
    pagination_class = None

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("info__name", "value")
    filter_fields = ("info", "value_type")
    ordering_fields = ("id", "info", "order")
    ordering = ("order",)

    def get_queryset(self):
        # 先得到info的id
        info_id = self.kwargs.get("info_id")
        queryset = InfoValue.objects.filter(info_id=info_id)
        return queryset


class InfoValueCreateApiView(generics.CreateAPIView):
    """
    Info Value Create Api View
    """
    queryset = InfoValue.objects.all()
    serializer_class = InfoValueModelSerializer
    permission_classes = (IsAuthenticated,)


class InfoValueListApiView(generics.ListAPIView):
    """
    Info Value List Api View
    """
    queryset = InfoValue.objects.all()
    serializer_class = InfoValueModelSerializer
    permission_classes = (IsAuthenticated,)
