# -*- coding:utf-8 -*-
"""
取消Django的CSRF验证中间件
"""
from django.utils.deprecation import MiddlewareMixin


class ApiDisableCsrfMiddleware(MiddlewareMixin):
    """
    api的请求都取消CSRF校验
    """

    def is_api_request(self, request):
        """
        判断是否是api的请求
        :param request: http request
        :return: True or False
        """
        path = request.path.lower()
        return path.startswith('/api/')

    def process_request(self, request):
        if self.is_api_request(request):
            # 给request设置属性，不要检验csrf token
            setattr(request, '_dont_enforce_csrf_checks', True)
