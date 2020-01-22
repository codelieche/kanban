# -*- coding:utf-8 -*-

from rest_framework import serializers

from docs.models.category import Category


class CategoryModelSerializer(serializers.ModelSerializer):
    """
    Docs Category Model Serializer
    """

    parent = serializers.SlugRelatedField(slug_field="code", queryset=Category.objects.all(), required=False)

    class Meta:
        model = Category
        fields = ("id", "name", "code", "image", "description", "parent", "time_added", "is_deleted")
