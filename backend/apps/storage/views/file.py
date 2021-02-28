"""
文件相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http.response import HttpResponseForbidden, HttpResponseRedirect, HttpResponse, FileResponse

from tags.models import ObjectTag
from storage.models.file import File
from storage.serializers.file import FileModelSerializer


class FileUploadApiView(generics.CreateAPIView):
    """
    上传文件
    """
    queryset = File.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAuthenticated,)


class FileListApiView(generics.ListAPIView):
    """
    文件列表
    """
    queryset = File.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("filename", "user__username", "objectkey")
    filter_fields = ("user", "is_active")
    ordering_fields = ("id", "user", "account", "time_added", "time_updated")
    ordering = ("-time_added",)

    def get_queryset(self):
        # 1. 获取请求信息
        user = self.request.user

        # 查看是否传递了tag__key，tag__value：这2个值可以以逗号分隔
        tag__keys = self.request.query_params.get("tag__keys")
        tag__values = self.request.query_params.get("tag__values")

        # 对tag进行处理
        tag__key_list = tag__keys.split(",") if tag__keys else []
        tag__value_list = tag__values.split(",") if tag__values else []

        # 判断是否传递了标签
        objecttag_ids = None
        if tag__key_list or tag__value_list:
            if tag__key_list:
                objecttag_queryset = ObjectTag.objects.filter(app_label="storage", model="file",
                                                              tagvalue__key__key__in=tag__key_list)
                if tag__value_list:
                    objecttag_queryset = objecttag_queryset.filter(tagvalue__value__in=tag__value_list)

            else:
                objecttag_queryset = ObjectTag.objects.filter(app_label="storage", model="file",
                                                              tagvalue__value__in=tag__value_list)
            # 得到对象的id：是object_id而不是取ObjectTag的id哦
            objecttag_ids = list(objecttag_queryset.values_list("object_id", flat=True))

        # 超级用户可以查看全部
        if user.is_superuser:
            if isinstance(objecttag_ids, list):
                queryset = File.objects.filter(id__in=objecttag_ids)
            else:
                queryset = File.objects.all()

        else:
            if isinstance(objecttag_ids, list):
                queryset = File.objects.filter(id__in=objecttag_ids, user=user)
            else:
                queryset = File.objects.filter(user=user)

        # 返回
        return queryset


class FileDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    图片详情api
    """
    queryset = File.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        # 判断权限
        if request.method != "PATCH":
            return HttpResponseForbidden()

        return super().update(request, *args, **kwargs)


class FileDetailObjectView(generics.RetrieveAPIView):
    """
    获取文件对象
    """
    queryset = File.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        # 获取到对象
        instance = super().get_object()

        if instance:
            if instance.account and instance.account.platform == "qiniu":
                # 获取文件的下载地址
                # http还是https
                scheme = request.META['wsgi.url_scheme']
                # Redis缓存
                file_download_url = instance.get_download_url(scheme=scheme)
                if file_download_url:
                    return HttpResponseRedirect(redirect_to=file_download_url, status=301)
                    # 不存在缓存中
                    # 竟然没返回图片地址，那么就从自身服务器获取

            # 没找到，或者没访问权限
            # 从服务器返回文件
            try:
                resp = FileResponse(open(instance.file.path, 'rb'))
                return resp
            except Exception as e:
                print(str(e))
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=404)


class ObjectRetrieveApiView(generics.RetrieveAPIView):
    """
    获取文件对象
    """
    queryset = File.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        instance = File.objects.filter(**kwargs).first()

        if instance:
            if instance.account and instance.account.platform == "qiniu":
                # 获取文件的下载地址
                # http还是https
                scheme = request.META['wsgi.url_scheme']
                # Redis缓存
                file_download_url = instance.get_download_url(scheme=scheme)
                if file_download_url:
                    return HttpResponseRedirect(redirect_to=file_download_url, status=301)
                    # 不存在缓存中
                    # 竟然没返回图片地址，那么就从自身服务器获取

            # 没找到，或者没访问权限
            # 从服务器返回文件
            try:
                resp = FileResponse(open(instance.file.path, 'rb'))
                return resp
            except Exception as e:
                print(str(e))
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=404)
