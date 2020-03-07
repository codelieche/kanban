from django.contrib import admin

from docs.models.category import Category, CategoryUser
from docs.models.info import InfoField, InfoCategory, Info, InfoValue
from docs.models.article import Article
# Register your models here.


class CategoryUserModelAdmin(admin.ModelAdmin):
    """Category User Model Serializer"""
    list_display = ("id", "category", "user", "permission")


class CategoryModelSerializer(admin.ModelAdmin):
    """
    Category Model Serializer
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
    Info Category Model Admin
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
admin.site.register(CategoryUser, CategoryUserModelAdmin)
admin.site.register(Category, CategoryModelSerializer)
admin.site.register(InfoField, InfoFieldModelAdmin)
admin.site.register(InfoCategory, InfoCategoryModelAdmin)
admin.site.register(Info, InfoModelAdmin)
admin.site.register(InfoValue, InfoValueModelAdmin)
