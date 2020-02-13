"""
页面信息相关的视图函数
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http.response import JsonResponse

from pages.models.info import InfoCategory, Info, InfoValue
from pages.serializers.info import (
    InfoValueModelSerializer
)


class InfoValueCreateApiView(generics.CreateAPIView):
    """
    Info Value Create Api View
    """
    queryset = InfoValue.objects.all()
    serializer_class = InfoValueModelSerializer
    permission_classes = (IsAuthenticated,)


class InfoValueAddApiView(APIView):
    """
    Info Add Api View
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # 测试
        content = {
            "status": True,
            "message": "添加成功"
        }
        return JsonResponse(content)


class InfoValueListApiView(generics.ListAPIView):
    """
    Info Value List Api View
    """
    queryset = InfoValue.objects.all()
    serializer_class = InfoValueModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("value",)
    # 注意列表页是根据page字段来分页的
    filter_fields = ("info", )
    ordering_fields = ("id", "info", "order")
    ordering = ("-id", )
