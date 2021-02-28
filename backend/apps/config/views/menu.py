# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly

from modellog.mixins import LoggingViewSetMixin
from config.models.menu import Menu
from config.serializers.menu import MenuModelSerializer


class MenuCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    Menu Create Api View
    """
    queryset = Menu.objects.all()
    serializer_class = MenuModelSerializer
    permission_classes = (DjangoModelPermissions,)


class MenuListApiView(generics.ListAPIView):
    """
    Menu List Api View
    """
    queryset = Menu.objects.filter(is_deleted=False)
    serializer_class = MenuModelSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class ListUserMenuListApiView(generics.ListAPIView):
    """
    List User Menu List  Api View
    用户有权限访问的菜单
    """
    # queryset = Menu.objects.filter(is_deleted=False)
    serializer_class = MenuModelSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        queryset = Menu.objects.filter(is_deleted=False, level=1)
        user = self.request.user
        # 权限判断
        for item in queryset:
            # 权限判断
            # print(user, item.id, item.permission, item.subs.all())
            children = item.children.all()
            for sub in children:
                if sub.permission:
                    if user.has_perm(sub.permission):
                        pass
                # print(user, sub, sub.permission, user.has_perm(sub.permission))
        return queryset

    def list(self, request, *args, **kwargs):
        user = request.user
        result = super().list(request, args, kwargs)

        menu_data = []

        data = result.data
        for item in data:
            subs_new = []
            for sub in item["children"]:
                # 判断权限
                permission = sub["permission"]
                # 如果未设置权限，或者用户有这个权限
                if not permission or user.has_perm(permission):
                    subs_new.append(sub)
                # 第三层权限不判断，后续优化成while判断权限

            # 修改当前menu的子菜单
            item["children"] = subs_new

            # 判断是否加入到menu_data中
            if len(subs_new) >= 0:
                menu_data.append(item)
        # print(data)
        # 对结果重新复制
        result.data = menu_data

        return result


class MenuDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Menu Detail Api View
    """
    queryset = Menu.objects.all()
    serializer_class = MenuModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly)
