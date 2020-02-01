# -*- coding:utf-8 -*-

from rest_framework import serializers

from task.models.category import Category


class CategoryModelSerializer(serializers.ModelSerializer):
    """
    Category Model Serializer
    """

    parent = serializers.SlugRelatedField(
        slug_field="code", queryset=Category.objects.all(), required=False)

    def validate(self, attrs):
        if attrs.get("parent"):
            code = attrs["code"]
            if code.find("/") < 0:
                parent = attrs["parent"]
                while parent:
                    code = "{}/{}".format(parent.code, code)
                    parent = parent.parent
                attrs["code"] = code

        return attrs

    class Meta:
        model = Category
        fields = (
            "id", "name", "code", "image", "description",
            "parent", "level", "order", "time_added", "is_deleted"
        )

        # validators = [
        #     serializers.UniqueTogetherValidator(
        #         queryset=Category.objects.all(),
        #         fields=('code', 'parent')
        #     )
        # ]
