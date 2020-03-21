"""
网站首页
"""
from django.shortcuts import render


def index_page(request):
    # 网站首页
    # print(request.META["REMOTE_ADDR"])
    return render(request, 'index.html')

