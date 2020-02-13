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
            "user", "parent", 
            "content", "order"
        )
        