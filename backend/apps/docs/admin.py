from django.contrib import admin

from docs.models.group import Group, GroupUser
from docs.models.info import InfoField, InfoCategory, Info, InfoValue
from docs.models.article import Article
# Register your models here.


class GroupUserModelAdmin(admin.ModelAdmin):
    """Group User Model Serializer"""
    list_display = ("id", "group", "user", "permission")


class GroupModelSerializer(admin.ModelAdmin):
    """
    Group Model Serializer
    """
    list_display = ("id", "name", "code", "description", "image")


class InfoFieldModelAdmin(admin.ModelAdmin):
    """
    Info Field Model Admin
    """
    list_display = ("id", "name", "name_verbose", "is_active")
    list_filter = ("is_active",)


class InfoCategoryModelAdmin(admin.ModelAdmin):
    """
    Info Group Model Admin
    """
    list_display = ("id", "name", "icon", "element", "order", "is_active")


class InfoModelAdmin(admin.ModelAdmin):
    """
    Info Model Admin
    """
    list_display = ("id", "category", "name", "article", "value_type", "is_multiple", "is_active")
    list_filter = ("category", "value_type", "is_multiple", "is_active")


class InfoValueModelAdmin(admin.ModelAdmin):
    """
    Info Value Model Admin
    """
    list_display = ("id", "info", "value", "value_type", "order", "color", "is_active")


# 注册model
admin.site.register(GroupUser, GroupUserModelAdmin)
admin.site.register(Group, GroupModelSerializer)
admin.site.register(InfoField, InfoFieldModelAdmin)
admin.site.register(InfoCategory, InfoCategoryModelAdmin)
admin.site.register(Info, InfoModelAdmin)
admin.site.register(InfoValue, InfoValueModelAdmin)
