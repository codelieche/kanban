# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.http.response import HttpResponseRedirect, HttpResponse, FileResponse

from storage.models.file import File
from storage.serializers.file import FileModelSerializer
from storage.tools.qiniu import QiniuApi


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
                # 获取qiniu的下载地址
                if instance.objectkey:
                    api = QiniuApi(instance.account.access_key, instance.account.secret_key, instance.account.bucket)
                    cloud_url = instance.cloud_url
                    # 获取对象的下载地址
                    if cloud_url:
                        # 如果是http的就用http的
                        schememe = request.META['wsgi.url_scheme']
                        if schememe == "http":
                            cloud_url = cloud_url.replace("https://", "http://")
                        result = api.private_download_url(cloud_url, expires=3600)
                        # print(result)
                        # result.replace("https://", "http://")
                        if result:
                            return HttpResponseRedirect(redirect_to=result)
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
