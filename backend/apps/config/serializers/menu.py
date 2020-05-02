# -*- coding:utf-8 -*-
from rest_framework import serializers

from config.models.menu import Menu


class MenuModelSerializer(serializers.ModelSerializer):
    """
    Menu Model Serializer
    """

    key = serializers.CharField(read_only=True, source="slug")

    def validate(self, attrs):
        # if "parent" not in attrs:
        #     attrs["parent"] = None
        is_link = attrs.get("is_link")
        if is_link and not attrs.get("link"):
            raise serializers.ValidationError("请传入站外链接的地址")
        return attrs

    def get_fields(self):
        fields = super().get_fields()
        # 这样就可以调用自身这个Serializer类了
        fields['children'] = MenuModelSerializer(many=True, read_only=True)
        return fields

    class Meta:
        model = Menu
        fields = (
            "id", "title", "key", "slug", "icon", "parent", "children", "permission",
            "target", "is_link", "link", "is_deleted", "level", "order"
        )
        # fields = (
        #     "order", "title", "key", "slug", "icon", "permission",
        #     "target", "is_link", "link", "is_deleted", "level", "children"
        # )
        # validators = [
        #     serializers.UniqueTogetherValidator(
        #         queryset=Menu.objects.all(),
        #         fields=('slug', 'parent')
        #     )
        # ]
