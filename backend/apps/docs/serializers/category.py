# -*- coding:utf-8 -*-

from rest_framework import serializers

from docs.models.category import Category


class CategoryModelSerializer(serializers.ModelSerializer):
    """
    Docs Category Model Serializer
    """

    parent = serializers.SlugRelatedField(slug_field="code", queryset=Category.objects.all(), 
                                          required=False, allow_null=True)

    def validate(self, attrs):
        if "parent" in attrs:
            code = attrs["code"]
            if code.find("-") < 0 and code.find("_") < 0:
                parent = attrs["parent"]
                # 二级目录包含了一级的code，三级目录只要加上二级目录的code即可
                if parent:
                    code = "{}-{}".format(parent.code, code)
                attrs["code"] = code

        return attrs
    
    def get_fields(self):
        fields = super().get_fields()
        # print(self.context["request"].data, self.context["request"].method)
        if self.context["request"].method == "GET":
            # 这样就可以调用自身这个Serializer类了
            fields['children'] = CategoryModelSerializer(many=True, read_only=True)

        # PUT方法，如果Image的标签为空，那么就设置Image为可读：或者用patch方法修改各字段
        if self.context["request"].method == "PUT":
            if "image" not in self.context["request"].data:
                image_field = fields["image"]
                image_field.read_only = True
        return fields

    class Meta:
        model = Category
        fields = ("id", "name", "code", "image", "description", "parent", "level", "order", "time_added", "is_deleted")
