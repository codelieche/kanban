# -*- coding:utf-8 -*-
from rest_framework import serializers

from config.models.menu import Menu


class MenuModelSerializer(serializers.ModelSerializer):
    """
    Menu Model Serializer
    """

    def validate(self, attrs):
        if "parent" not in attrs:
            attrs["parent"] = None
        return attrs

    def get_fields(self):
        fields = super().get_fields()
        # 这样就可以调用自身这个Serializer类了
        fields['subs'] = MenuModelSerializer(many=True, read_only=True)
        return fields

    class Meta:
        model = Menu
        fields = (
            "id", "title", "slug", "icon", "parent", "subs", "permission",
            "target", "link", "is_deleted", "level"
        )
        # validators = [
        #     serializers.UniqueTogetherValidator(
        #         queryset=Menu.objects.all(),
        #         fields=('slug', 'parent')
        #     )
        # ]
