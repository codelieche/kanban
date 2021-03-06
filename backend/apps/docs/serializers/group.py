# -*- coding:utf-8 -*-

from rest_framework import serializers

from account.models import User
from docs.models.group import Group, GroupUser


class GroupUserAddSerializer(serializers.Serializer):
    """
    给分类添加用户时使用
    """
    group = serializers.SlugRelatedField(slug_field="id", queryset=Group.objects.all(), 
                                         required=True)
    user = serializers.SlugRelatedField(many=True, slug_field="username", queryset=User.objects.all())
    permission = serializers.CharField(default="R", required=False)


class GroupUserModelSerializer(serializers.ModelSerializer):
    """
    分类用户多对多关系
    """
    group = serializers.SlugRelatedField(slug_field="id", queryset=Group.objects.all(),
                                         required=True)
    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        # 1. 获取到请求的用户
        user = self.context["request"].user
        group = validated_data["group"]

        # 2. 判断用户是否有增加用户的权限
        result = group.check_user_permission(user, "add_user")
        if not result:
            return serializers.ValidationError("无权限")

        # 3. 执行默认的创建操作
        return super().create(self, validated_data)

    class Meta:
        model = GroupUser
        fields = ("id", "group", "user", "permission", "time_added", "is_active")


class GroupParentSimpleModelSerializer(serializers.ModelSerializer):
    """
    分组父类的简单信息
    """
    # 所有者
    owner = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all(),
                                         required=False)

    class Meta:
        model = Group
        fields = ("id", "name", "code", "image", "owner")


class GroupModelSerializer(serializers.ModelSerializer):
    """
    Docs Group Model Serializer
    """

    parent = serializers.SlugRelatedField(slug_field="id", queryset=Group.objects.all(), 
                                          required=False, allow_null=True)
    # 分组用户
    users = serializers.SlugRelatedField(many=True, slug_field="username", queryset=User.objects.all(),
                                        required=False)
    # 所有者
    owner = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all(),
                                         required=False)
    # users是会返回分组中的所有用户，但是users_permission只包含is_active是True的用户
    users_permisson = GroupUserModelSerializer(required=False, many=True, read_only=True)

    def validate(self, attrs):
        if "parent" in attrs:
            code = attrs["code"]
            if code.find("-") < 0 and code.find("_") < 0:
                parent = attrs["parent"]
                # 二级目录包含了一级的code，三级目录只要加上二级目录的code即可
                if parent:
                    code = "{}-{}".format(parent.code, code)
                attrs["code"] = code
        
        # 处理owner：superuser可以指定owner
        user = self.context["request"].user
        if user.is_superuser:
            if "owner" not in attrs or (not attrs["owner"]):
                attrs["owner"] = user
        else:
            # 不是超级用户，创建的分类，所有者只能是自己
            attrs["owner"] = user
        return attrs

    def create(self, validated_data):
        # 1. 调用父类的创建方法
        instance = super().create(validated_data)

        # 2. 给当前用户添加所有权限
        group_user, created = GroupUser.objects.get_or_create(group=instance, user=instance.owner)
        if group_user.permission != "ALL":
            group_user.permission = "ALL"
            group_user.save()
        
        # 3. 返回实例
        return instance
    
    def get_fields(self):
        fields = super().get_fields()
        # print(self.context["request"].data, self.context["request"].method)
        if self.context["request"].method == "GET":
            # 这样就可以调用自身这个Serializer类了
            fields['parent'] = GroupParentSimpleModelSerializer(many=False, read_only=True)
            fields['children'] = GroupModelSerializer(many=True, read_only=True)
            # fields["subs"] = fields["children"]
            # del fields["children"]

        # PUT方法，如果Image的标签为空，那么就设置Image为可读：或者用patch方法修改各字段
        if self.context["request"].method == "PUT":
            if "image" not in self.context["request"].data:
                image_field = fields["image"]
                image_field.read_only = True
        return fields

    class Meta:
        model = Group
        fields = ("id", "name", "code", "image", "description", "parent", "parent_id",
                   "owner", "users", "users_permisson",
                  "level", "order", "time_added", "is_deleted")
