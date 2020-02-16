"""
页面相关的序列化
"""
from rest_framework import serializers

from docs.models.article import Article


class ArticleModelSerializer(serializers.ModelSerializer):
    """
    Article Model Serializer
    """

    def validate(self, attrs):
        # 设置user
        user = self.context["request"].user
        attrs["user"] = user

        # 判断如果传递了parent，那么分类与parent相同
        if "parent" in attrs:
            parent = attrs["parent"]
            if parent:
                attrs["category"] = parent.category

        return attrs

    class Meta:
        model = Article
        fields = (
            "id", "title", "category", "icon", "description", "cover", 
            "user", "parent", "infovalues",
            "content", "order", "level"
        )


class ArticleWithInfovaluesListSerializer(serializers.ModelSerializer):
    """
    获取文章的列表，
    只显示ID、标题、属性
    """

    class Meta:
        model = Article
        fields = ("id", "title", "infovalues")
