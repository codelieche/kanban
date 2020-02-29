"""
页面相关的序列化
"""
from rest_framework import serializers

from account.models import User

from docs.models.article import Article


class ArticleModelSerializer(serializers.ModelSerializer):
    """
    Article Model Serializer
    """

    user = serializers.SlugRelatedField(slug_field="username", 
                                        queryset=User.objects.all(), required=False)

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

    def get_fields(self):
        fields = super().get_fields()
        # 如果是获取子页面

        return fields

    class Meta:
        model = Article
        fields = (
            "id", "title", "category", "icon", "description", "cover", 
            "user", "parent", "infovalues", "time_added",
            "content", "order", "level"
        )


class ArticleParentInfoSerializer(serializers.ModelSerializer):
    """
    文章的父亲信息
    """

    def get_fields(self):
        fields = super().get_fields()
        fields["parent"] = ArticleParentInfoSerializer(read_only=True, required=False)
        return fields

    class Meta:
        model = Article
        fields = ("id", "title", "parent")


class ArticleListModelSerializer(serializers.ModelSerializer):
    """
    Article List Model Serializer
    """

    user = serializers.SlugRelatedField(slug_field="username", read_only=True, required=False)
    parent = ArticleParentInfoSerializer(read_only=True, required=False)

    def get_fields(self):
        fields = super().get_fields()
        # 如果是获取子页面
        return fields

    class Meta:
        model = Article
        fields = (
            "id", "title", "category", "icon", "description", "cover", 
            "user", "parent", "infovalues", "time_added",
            "order", "level"
        )


class ArticleDetailSerializer(serializers.ModelSerializer):
    """
    Article Detail Model Serializer
    """

    parent = ArticleParentInfoSerializer(read_only=True, required=False)

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

    def get_fields(self):
        fields = super().get_fields()
        # 如果是获取子页面
        fields["children"] = ArticleDetailSerializer(many=True, required=False, read_only=True)
        return fields

    class Meta:
        model = Article
        fields = (
            "id", "title", "category", "icon", "description", "cover", 
            "user", "parent", "infovalues",
            "content", "order", "level"
        )


class ArticleAllSerializer(serializers.ModelSerializer):
    """
    左侧导航获取所有文章列表
    """

    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    def get_fields(self):
        fields = super().get_fields()
        fields["children"] = ArticleAllSerializer(many=True, read_only=True)
        return fields

    class Meta:
        model = Article
        fields = (
            "id", "title", "icon", "category", "user", "order", "level", "children"
        )

class ArticleWithInfovaluesListSerializer(serializers.ModelSerializer):
    """
    获取文章的列表
    只显示ID、标题、属性
    """

    class Meta:
        model = Article
        fields = ("id", "title", "infovalues")
