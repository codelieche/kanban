# -*- coding:utf-8 -*-

from django.urls import path

from utils.views.password import PasswordDecryptoApiView


urlpatterns = [
    # 前缀：/api/v1/utils/
    path('password/decrypto', PasswordDecryptoApiView.as_view(), name="password_decrypto"),
]
