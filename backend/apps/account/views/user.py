# -*- coding:utf-8 -*-
"""
账号登陆登出相关api
"""
import re

from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponseForbidden

from codelieche.views.viewset import ModelViewSet
from utils.permissions import IsSuperUserOrReadOnly
from modellog.mixins import LoggingViewSetMixin
from account.serializers.user import (
    UserModelSerializer,
    UserLoginSerializer,
    UserChangePasswordSerializer,
    UserAllListSerializer,
    UserSimpleInfoSerializer,
    UserDetailSerializer
)
from account.models import User


class LoginView(APIView):
    """
    用户登陆api View
    1. GET: 判断用户是否登陆
    2. POST: 账号登陆
    """

    def get(self, request):
        # get判断当前客户端是否登陆
        # 如果登陆了返回{logined: true},未登录返回{logined: false}
        user = request.user
        if user.is_authenticated:
            content = {
                "logined": True,
                "username": user.username,
                "nick_name": user.nick_name,
                "is_superuser": user.is_superuser
            }
        else:
            content = {
                "logined": False
            }

        return JsonResponse(data=content)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get("username", "")
            password = serializer.validated_data.get("password", "")

            # 调用authenticate方法：注意settings.py中的AUTHTICATION_BACKENDS
            user = authenticate(username=username, password=password)

            if user is not None:
                # 判断是否可以访问本系统
                if not user.can_view:
                    content = {
                        "status": False,
                        "message": "用户({})不能访问本系统，请找管理员开通访问权限".format(user.username)
                    }
                    return JsonResponse(data=content, status=status.HTTP_403_FORBIDDEN)

                # 登陆
                if user.is_active:
                    login(request, user)
                    content = {
                        "status": True,
                        "username": user.username,
                        "message": "登陆成功",
                    }
                else:
                    content = {
                        "status": False,
                        "message": "用户({})已被禁用".format(user.username)
                    }
                return JsonResponse(data=content, status=status.HTTP_200_OK)
            else:
                content = {
                    "status": False,
                    "message": "账号或者密码不正确"
                }
                return JsonResponse(data=content, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def account_logout(request):
    """
    退出登陆
    :param request: http请求
    :return:
    """
    logout(request)
    # 有时候会传next
    next_url = request.GET.get("next", "/")
    return JsonResponse({"status": True, "next": next_url})


class UserApiModelViewSet(ModelViewSet):
    """
    User Api View Set
    """
    queryset = User.objects.all()
    serializer_class = UserAllListSerializer
    serializer_class_set = (UserAllListSerializer, UserDetailSerializer)
    permission_classes = (IsAuthenticated,)
    # filter
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("username", "mobile")
    filter_fields = ("is_active", "is_superuser", "is_deleted", "can_view")
    ordering_fields = ("id", "mobile")
    orderint = ("id",)

    def destroy(self, request, *args, **kwargs):
        # 第1步：获取到用户
        user = self.get_object()
        if user == request.user:
            content = {
                "message": "不可以删除自己"
            }
            return Response(content, status=400)

        # 第2步：对用户进行删除
        # 2-1：设置deleted和is_active
        user.is_deleted = True
        user.is_active = False
        user.save()

        # 第3步：返回响应
        response = Response(status=204)
        return response

    @action(methods=["PUT"], detail=False, description="修改密码API", url_path='password/change')
    def change_password(self, request):
        """
        通过PUT方法更新自己的密码
        """
        # 1. 获取到用户和密码信息
        user = request.user
        serializer = UserChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get("username", "").strip()
            old_password = serializer.validated_data.get("old_password", "").strip()
            password = serializer.validated_data.get("password", "").strip()
            re_password = serializer.validated_data.get("re_password", "").strip()

            # 2. 校验密码
            # 2-1： 检查用户旧的密码和账号
            # 检查当前用户的用户名
            if user.username != username:
                content = {
                    "status": False,
                    "message": "传入的username与当前登录的用户不匹配"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

            if not user.check_password(old_password):
                # 传入的旧密码错误
                content = {
                    "status": False,
                    "message": "传入的旧密码不正确"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

            # 2-2：检查新的密码
            if password != re_password:
                # 密码错
                content = {
                    "status": False,
                    "message": "传入的密码和重复密码不相同"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

            # 2-3: 校验密码长度等是否符合规则: 数字+字符/特殊字符(6-16位)
            if not re.match("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,16}$", password):
                content = {
                    "status": False,
                    "message": "密码不符合要求:(由数字+字符/特殊字符组成，长度6-16位)"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

            # 第3步：修改密码
            user.set_password(password)
            user.save()
            content = {
                "status": True,
                "message": "密码修改成功"
            }
            # 退出登录
            logout(request)
            # 返回成功结果
            return JsonResponse(data=content)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["PUT"], detail=False, description="重置密码API", url_path="password/reset")
    def password_reset(self, request):
        # 1. 获取到用户
        user = request.user

        # 2. 判断是否是超级用户
        if not user.is_superuser:
            return HttpResponseForbidden()

        # 3. 超级用户才可重置别人的密码
        # 3-1：校验数据
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            # 3-2：获取到数据
            username = serializer.validated_data.get("username")
            password = serializer.validated_data.get("password")

            target_user = User.objects.filter(username=username).first()
            if not target_user:
                content = {
                    "status": False,
                    "message": "用户{}不存在".format(username)
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)
            else:
                # 校验密码
                if not re.match("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,16}$", password):
                    content = {
                        "status": False,
                        "message": "密码不符合要求:(由数字+字符/特殊字符组成，长度6-16位)"
                    }
                    return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

                # 重置用户的密码
                target_user.set_password(password)
                target_user.save()

                # 返回成功的结果
                content = {
                    "status": True,
                    "message": "重置{}的密码成功".format(username)
                }
                # 返回成功结果
                return JsonResponse(data=content)

        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 下面的是老的写法，后续逐渐废弃掉，尽量使用ModelViewSet的写法
class UserCreateApiView(generics.CreateAPIView):
    """
    用户添加API
    """

    queryset = User.objects.all()
    serializer_class = UserModelSerializer


class UserListView(generics.ListAPIView):
    """
    用户列表
    """
    queryset = User.objects.all()
    serializer_class = UserAllListSerializer
    permission_classes = (IsAuthenticated,)
    # filter
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("username", "mobile")
    filter_fields = ("is_active", "is_superuser", "is_deleted", "can_view")
    ordering_fields = ("id", "mobile")
    orderint = ("id",)


class UserAllListView(generics.ListAPIView):
    """
    所有用户列表
    """
    queryset = User.objects.all()
    serializer_class = UserAllListSerializer
    # 分页和权限
    pagination_class = None
    # 权限
    permission_classes = (IsAuthenticated, )


class UserDetailView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    用户详情api
    1. GET：获取用户详情
    2. PUT：修改用户信息
    3. DELETE：删除用户信息【需要自定义】
    """
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    # 权限控制
    permission_classes = (IsSuperUserOrReadOnly,)

    def delete(self, request, *args, **kwargs):
        # 第1步：获取到用户
        user = self.get_object()
        if user == request.user:
            content = {
                "message": "不可以删除自己"
            }
            return Response(content, status=400)

        # 第2步：对用户进行删除
        # 2-1：设置deleted和is_active
        user.is_deleted = True
        user.is_active = False
        user.save()

        # 第3步：返回响应
        response = Response(status=204)
        return response


class UserChangePasswordApiView(APIView):
    """
    修改用户密码
    """
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        """通过PUT方法更新自己的密码"""
        # 1. 获取到用户和密码信息
        user = request.user
        serializer = UserChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get("username", "").strip()
            old_password = serializer.validated_data.get("old_password", "").strip()
            password = serializer.validated_data.get("password", "").strip()
            re_password = serializer.validated_data.get("re_password", "").strip()

            # 2. 校验密码
            # 2-1： 检查用户旧的密码和账号
            # 检查当前用户的用户名
            if user.username != username:
                content = {
                    "status": False,
                    "message": "传入的username与当前登录的用户不匹配"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

            if not user.check_password(old_password):
                # 传入的旧密码错误
                content = {
                    "status": False,
                    "message": "传入的旧密码不正确"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)
            
            # 2-2：检查新的密码
            if password != re_password:
                # 密码错
                content = {
                    "status": False,
                    "message": "传入的密码和重复密码不相同"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)
            
            # 2-3: 校验密码长度等是否符合规则: 数字+字符/特殊字符(6-16位)
            if not re.match("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,16}$", password):
                content = {
                    "status": False,
                    "message": "密码不符合要求:(由数字+字符/特殊字符组成，长度6-16位)"
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)
            
            # 第3步：修改密码
            user.set_password(password)
            user.save()
            content = {
                "status": True,
                "message": "密码修改成功"
            }
            # 退出登录
            logout(request)
            # 返回成功结果
            return JsonResponse(data=content)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserResetPasswordApiView(APIView):
    """
    用户重置密码
    """

    def put(self, request):
        # 1. 获取到用户
        user = request.user

        # 2. 判断是否是超级用户
        if not user.is_superuser:
            return HttpResponseForbidden()

        # 3. 超级用户才可重置别人的密码
        # 3-1：校验数据
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            # 3-2：获取到数据
            username = serializer.validated_data.get("username")
            password = serializer.validated_data.get("password")

            target_user = User.objects.filter(username=username).first()
            if not target_user:
                content = {
                    "status": False,
                    "message": "用户{}不存在".format(username)
                }
                return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)
            else:
                # 校验密码
                if not re.match("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,16}$", password):
                    content = {
                        "status": False,
                        "message": "密码不符合要求:(由数字+字符/特殊字符组成，长度6-16位)"
                    }
                    return JsonResponse(data=content, status=status.HTTP_400_BAD_REQUEST)

                # 重置用户的密码
                target_user.set_password(password)
                target_user.save()

                # 返回成功的结果
                content = {
                    "status": True,
                    "message": "重置{}的密码成功".format(username)
                }
                # 返回成功结果
                return JsonResponse(data=content)

        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)