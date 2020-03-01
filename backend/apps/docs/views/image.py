"""
图片相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from docs.models.image import Image
from docs.serializers.image import ImageModelSerializer


class ImageUploadApiView(generics.CreateAPIView):
    """
    创建图片
    """

    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = (IsAuthenticated,)


class ImageListApiView(generics.ListAPIView):
    """
    图片列表
    """

    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("filename", "user__username", "qiniu")
    filter_fields = ("user", "is_active")
    ordering_fields = ("id", "user", "time_added", "is_active")
    ordering = ("-time_added", )



class ImageDetailApiView(generics.RetrieveDestroyAPIView):
    """
    创建图片
    """

    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = (IsAuthenticated,)
