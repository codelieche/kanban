"""
页面信息相关的视图函数
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http.response import JsonResponse, HttpResponse

from pages.models.info import InfoCategory, Info, InfoValue
from pages.models.page import Page
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
        # 先获取到page和info
        page_id = request.data.get("page", None)
        if not page_id:
            content = {
                "status": False,
                "message": "请传入page字段"
            }
            return JsonResponse(data=content, status=400)
        page = Page.objects.filter(id=page_id).first()
        if not page:
            content = {
                "status": False,
                "message": "id为{}的Page不存在".format(page_id)
            }
            return JsonResponse(data=content, status=400)

        # 判断info
        info_id = request.data.get("info", None)
        if not info_id:
            content = {
                "status": False,
                "message": "请传入info字段"
            }
            return JsonResponse(data=content, status=400)
        
        info = Info.objects.filter(id=info_id).first()
        if not info:
            content = {
                "status": False,
                "message": "id为{}的Info不存在".format(info_id)
            }
            return JsonResponse(data=content, status=400)
        
        # 获取value
        value = request.data.get("value", None)
        if not value:
            content = {
                "status": False,
                "message": "请传入信息的值"
            }
            return JsonResponse(data=content, status=400)
        
        # 获取InfoValue对象
        infovalue, created = InfoValue.objects.get_or_create(info=info, value=value, is_active=True)

        # 这里可优化一下，减少sql的操作
        # info不是多个的话，就需要清空以前的
        if not info.is_multiple:
            old_infovalues = page.infovalue_set.filter(info=info).exclude(id=infovalue.id).all()
            # print(old_infovalues)
            # print("========== 清空旧的infovalue =========")
            for infovalue_old in old_infovalues:
                infovalue_old.pages.remove(page)
        
        # 查看page的所有infovalue
        #print(page.infovalue_set.all())
        print(infovalue)
        # print(infovalue.pages.all())

        # 给page添加到新的infovalue中
        infovalue.pages.add(page)
        infovalue.save()

        serializer = InfoValueModelSerializer(infovalue)

        content = {
            "status": True,
            "message": "添加成功",
            # "infovalue": infovalue.id,
            "data": serializer.data,
        }
        return JsonResponse(content)


class InfoValueDeleteApiView(APIView):
    """删除Page的InfoValue"""

    permission_classes = (IsAuthenticated, )

    def delete(self, request):
        # 删除Page的InfoValue
        # url: infovalue
        return JsonResponse(status=204)



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


class InfoValueDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """Info Value Detail Api View"""
    queryset = InfoValue.objects.all()
    serializer_class = InfoValueModelSerializer
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        # 删除操作暂时不支持，移除全部
        # 判断是否传入了page，如果传入了page就是表示把page从infovalue中移除
        page_id = request.query_params.get("page")
        if not page_id:
            content = {
                "status": False,
                "message": "请传入page字段"
            }
            return JsonResponse(data=content, status=400)
        page = Page.objects.filter(id=page_id).first()
        if not page:
            content = {
                "status": False,
                "message": "id为{}的Page不存在".format(page_id)
            }
            return JsonResponse(data=content, status=400)
        
        instance = super().get_object()
        instance.pages.remove(page)
        return HttpResponse(status=204)
