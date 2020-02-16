"""
文章信息相关的视图函数
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.http.response import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404

from docs.models.info import InfoCategory, Info, InfoValue
from docs.models.article import Article
from docs.serializers.info import (
    InfoValueModelSerializer
)
from docs.serializers.article import ArticleModelSerializer


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
        # 先获取到article和info
        article_id = request.data.get("article", None)
        if not article_id:
            content = {
                "status": False,
                "message": "请传入article字段"
            }
            return JsonResponse(data=content, status=400)
        article = Article.objects.filter(id=article_id).first()
        if not article:
            content = {
                "status": False,
                "message": "id为{}的Article不存在".format(article_id)
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
        # info不是多个的话，就需要清空以前的, tags,user类型的是可以多个的
        if not info.is_multiple:
            old_infovalues = article.infovalue_set.filter(info=info).exclude(id=infovalue.id).all()
            # print("========== 清空旧的infovalue =========")
            for infovalue_old in old_infovalues:
                infovalue_old.docs.remove(article)
        
        # 查看article的所有infovalue
        #print(article.infovalue_set.all())
        # print(infovalue.docs.all())

        # 给article添加到新的infovalue中
        infovalue.articles.add(article)
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
    """删除文章的InfoValue"""

    permission_classes = (IsAuthenticated, )

    def delete(self, request):
        # 删除文章的InfoValue
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
        # 判断是否传入了article，如果传入了article就是表示把article从infovalue中移除
        article_id = request.query_params.get("article")
        if not article_id:
            content = {
                "status": False,
                "message": "请传入article字段"
            }
            return JsonResponse(data=content, status=400)
        article = Article.objects.filter(id=article_id).first()
        if not article:
            content = {
                "status": False,
                "message": "id为{}的文章不存在".format(article_id)
            }
            return JsonResponse(data=content, status=400)
        
        instance = super().get_object()
        instance.docs.remove(article)
        return HttpResponse(status=204)


class InfoValueListAllArticleApiView(generics.ListAPIView):
    """获取属性值对应的所有文章列表"""

    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        """通过属性值获取其所有的文章"""
        infovalue_id = self.kwargs.get("pk", 0)
        infovalue = get_object_or_404(InfoValue, pk=infovalue_id)

        articles = infovalue.articles.all()
        return articles
