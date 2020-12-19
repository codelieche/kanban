"""
图片相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http.response import HttpResponseForbidden

from tags.models import ObjectTag
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

    def get_queryset(self):
        # 1. 获取请求信息: 
        user = self.request.user

        # 查看是否传递了tag__key, tag__value：这2个值可以以逗号分隔
        tag__keys = self.request.query_params.get("tag__keys")
        tag__values = self.request.query_params.get("tag__values")

        # 对tag进行处理
        tag__key_list = tag__keys.split(",") if tag__keys else []
        tag__value_list = tag__values.split(",") if tag__values else []

        # 判断是否传递了标签
        objecttag_ids = None
        if tag__key_list or tag__value_list:
            if tag__key_list:
                objecttag_queryset = ObjectTag.objects.filter(app_label="docs", model="image", 
                                                              tagvalue__key__key__in=tag__key_list)
                if tag__value_list:
                    objecttag_queryset = objecttag_queryset.filter(tagvalue__value__in=tag__value_list)
            else:
                objecttag_queryset = ObjectTag.objects.filter(app_label="docs", model="image",
                                                              tagvalue__value__in=tag__value_list)
            
            # 得到对象的id: 是object_id而不是取ObjectTag的id哦
            objecttag_ids = list(objecttag_queryset.values_list("object_id", flat=True))
        
        # print("图片id列表：", objecttag_ids)
        # 超级用户可以查看全部
        if user.is_superuser:
            if isinstance(objecttag_ids, list):
                queryset = Image.objects.filter(id__in=objecttag_ids)
            else:
                queryset = Image.objects.all()
        else:
            if isinstance(objecttag_ids, list):
                queryset = Image.objects.filter(id__in=objecttag_ids, user=user)
            else:
                queryset = Image.objects.filter(user=user)
        
        # 返回结果集
        return queryset


class ImageDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    图片详情api
    """
    queryset = Image.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        # 判断权限
        if request.method != "PATCH":
            return HttpResponseForbidden()

        return super().update(request, *args, **kwargs)
