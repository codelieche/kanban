# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.http.response import HttpResponseRedirect, HttpResponse, FileResponse

from storage.models.file import File
from storage.serializers.file import FileModelSerializer


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
