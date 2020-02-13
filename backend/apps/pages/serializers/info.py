"""
页面信息相关的序列化
"""
from rest_framework import serializers

from pages.models.info import InfoField, InfoCategory, Info, InfoValue


class InfoCategoryModelSerializer(serializers.ModelSerializer):
    """"
    Info Category Model Serializer
    """

    fields = serializers.SlugRelatedField(slug_field="name", many=True, queryset=InfoField.objects.all())

    class Meta:
        model = InfoCategory
        fields = ("id", "name", "icon", "element", "fields", "order", "is_active")


class InfoModelSerializer(serializers.ModelSerializer):
    """
    Info Model Serilizer
    """

    def validate(self, attrs):
        # 如果是更新那么需要丢弃page
        if "page" in attrs or "page_id" in attrs:
            request = self.context["request"]
            if request.method in ["PUT", "PATCH"]:
                # 丢弃page或者page_id
                if "page" in attrs: attrs.pop("page")
                if "page_id" in attrs: attrs.pop("page_id")
        # 返回处理后的attrs
        return attrs

    def update(self, instance, validated_data):
        # 如果分类变更了，是需要做一定的操作的。最简单的方式是丢弃掉它的所有值
        return super().update(instance, validated_data)

    class Meta:
        model = Info
        fields = ("id", "category", "name", "page", "value_type", "is_multiple", "is_active")


class InfoValueModelSerializer(serializers.ModelSerializer):
    """
    Info Value Model Serilizer
    """

    class Meta:
        model = InfoValue
        fields = ("id", "info", "pages", "value", "value_type", "color", "is_active")
