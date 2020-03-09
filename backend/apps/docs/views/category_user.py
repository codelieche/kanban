"""
分类用户相关操作
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
# from django.db.models import Q
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.http.response import JsonResponse

from account.models import User
from docs.models.category import CategoryUser, Category
from docs.serializers.category import CategoryUserModelSerializer, CategoryUserAddSerializer


class CategoryUserAddApiView(generics.CreateAPIView):
    """
    分组添加用户
    """
    queryset = CategoryUser.objects.all()
    serializer_class = CategoryUserAddSerializer
    permission_classes = (IsAuthenticated, )

    def create(self, *args, **kwargs):
        # 1. 从请求中获取分类和用户
        user = self.request.user
        category_id = self.request.data.get("category")
        users_username = self.request.data.getlist("user")
        permission = self.request.data.get("permission", "R")

        # 2. 获取分类对象
        category = Category.objects.filter(code=category_id).first()
        if not category:
            content = {
                "status": False,
                "message": "分类(%s)不存在" % category_id
            }
            return JsonResponse(data=content, status=404)

        # 3. 判断用户是否有增加用户的权限
        result = category.check_user_permission(user, "add_user")
        if not result:
            content = {
                "status": False,
                "message": "用户(%s)不可给分类(%s)添加用户" % (user.username, category_id)
            }
            return JsonResponse(data=content, status=403)
        
        # 4. 执行添加用户操作
        # 4-1: 获取用户
        users = User.objects.filter(username__in=users_username)

        results = []
        for u in users:
            instance, created = CategoryUser.objects.get_or_create(category=category, user=u)
            # print(instance, created)
            if instance.permission == "R" and instance.permission != permission:
                instance.permission = permission
                instance.save()
            # 判断是否是删除的
            if not instance.is_active:
                instance.is_active = True
                instance.save()

            results.append(instance)

        # 5. 返回结果
        serializers = CategoryUserModelSerializer(data=results, many=True)
        # print(serializers.is_valid(), results)
        serializers.is_valid()
        return Response(serializers.data)


class CategoryUserDeleteApiView(generics.DestroyAPIView):
    """
    分组添加用户
    """
    queryset = CategoryUser.objects.all()
    serializer_class = CategoryUserAddSerializer
    permission_classes = (IsAuthenticated, )

    def delete(self, request):
        # 1. 从请求中获取分类和用户
        user = self.request.user
        category_id = self.request.query_params.get("category")
        users_username = self.request.query_params.getlist("user")

        # 2. 获取分类对象
        category = Category.objects.filter(code=category_id).first()
        if not category:
            content = {
                "status": False,
                "message": "分类(%s)不存在" % category_id
            }
            return JsonResponse(data=content, status=404)

        # 3. 判断用户是否有增加用户的权限
        result = category.check_user_permission(user, "delete_user")
        if not result:
            content = {
                "status": False,
                "message": "用户(%s)不可给分类(%s)删除用户" % (user.username, category_id)
            }
            return JsonResponse(data=content, status=403)
        
        # 4. 执行删除用户操作
        # 4-1: 获取用户、删除用户
        for instance in CategoryUser.objects.filter(category=category, user__username__in=users_username).all():
            instance.delete()

        # 5. 返回结果
        return Response(status=204)


class CategoryUserListApiView(generics.ListAPIView):
    """
    分组用户列表
    """
    queryset = CategoryUser.objects.all()
    serializer_class = CategoryUserModelSerializer
    permission_classes = (IsAuthenticated, )

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("category__title", "category__code", "user__username")
    filter_fields = ("category", "category__code", "category_id", "user", "user__username", "permission")
    ordering_fields = ("category", "user", "id", "permission")
    ordering = ("id",)


class CategoryUserDetailApiView(generics.RetrieveDestroyAPIView):
    """
    分组用户详情
    """
    queryset = CategoryUser.objects.all()
    serializer_class = CategoryUserModelSerializer
    permission_classes = (IsAuthenticated, )

    def update(self, *args, **kwargs):
        """
        删除分组用户
        """
        # 1. 获取到请求的用户
        user = self.request.user
        instance = self.get_object()

        # 2. 判断用户是否有修改用户的权限
        result = instance.check_user_permission(user, "update_user")
        if not result:
            return HttpResponse(status=403)

        # 3. 执行默认的删除操作
        return super().update(self, *args, **kwargs)


    def destroy(self, *args, **kwargs):
        """
        删除分组用户
        """
        # 1. 获取到请求的用户
        user = self.request.user
        instance = self.get_object()

        # 2. 判断用户是否有删除的权限
        result = instance.check_user_permission(user, "delete_user")
        if not result:
            return HttpResponse(status=403)

        # 3. 执行默认的删除操作
        return super().destroy(self, *args, **kwargs)
