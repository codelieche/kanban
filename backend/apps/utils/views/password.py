# -*- coding:utf-8 -*-
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.conf import settings

from utils.tools.password import Cryptography


class PasswordDecryptoApiView(APIView):
    """
    加密的密码解码api
    加密的秘钥是使用默认的，如果传递了password_key则使用传递的
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # 1. 接收传过来的数据
        value = request.data.get('value', '')
        key = request.data.get('key', settings.PASSWORD_KEY)
        user_password = request.data.get('user_password', '')

        # 2. 验证用户输入自己的密码是否正确
        user = request.user
        result = authenticate(username=user.username, password=user_password)

        if not result:
            content = {
                'status': False,
                'message': '您输入自己账号的密码不正确'
            }
        else:
            # 3. 开始解密操作
            if not value:
                content = {
                    'status': False,
                    'message': '传入的密码为空',
                }
            else:
                # 判断是否可以解密
                p = Cryptography(key=key)
                success, de_p = p.check_can_decrypt(value=value)

                if success:
                    content = {
                        'status': True,
                        'message': '解密成功',
                        'password': de_p
                    }
                else:
                    content = {
                        'status': False,
                        'message': '需要解密的字符不正确'
                    }
        # 返回结果
        return Response(data=content)
