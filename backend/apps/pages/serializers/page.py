"""
页面相关的序列化
"""
from rest_framework import serializers

from pages.models.page import Page


class PageModelSerializer(serializers.ModelSerializer):
    """
    Page Model Serializer
    """

    def validate(self, attr):
        # 设置user
        user = self.context["request"].user
        attr["user"] = user

        return attr

    class Meta:
        model = Page
        fields = (
            "id", "title", "category", "icon", "description", "cover", 
            "user", "parent", "infovalues",
            "content", "order"
        )


class PageWithInfovaluesListSerializer(serializers.ModelSerializer):
    """
    获取Page的列表，
    只显示ID、标题、属性
    """

    class Meta:
        model = Page
        fields = ("id", "title", "infovalues")
