# -*- coding:utf-8 -*-
from rest_framework import serializers

from docs.models.category import Category
from docs.models.article import Article
# from docs.serializers.category import CategoryModelSerializer


class ArticleModelSerializer(serializers.ModelSerializer):
    """
    Article Model Serializer
    """
    categories = serializers.SlugRelatedField(slug_field="code", many=True, queryset=Category.objects.all())
    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    class Meta:
        model = Article
        fields = ("id", "categories", "title", "content", "user", "time_added", "is_deleted", "jobs")
