from django.contrib import admin

from pages.models.info import InfoField, InfoCategory, Info, InfoValue
from pages.models.page import Page
# Register your models here.


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
    list_display = ("id", "category", "name", "page", "value_type", "is_multiple", "is_active")
    list_filter = ("category", "value_type", "is_multiple", "is_active")


class InfoValueModelAdmin(admin.ModelAdmin):
    """
    Info Value Model Admin
    """
    list_display = ("id", "info", "value", "value_type", "order", "color", "is_active")


# 注册model
admin.site.register(InfoField, InfoFieldModelAdmin)
admin.site.register(InfoCategory, InfoCategoryModelAdmin)
admin.site.register(Info, InfoModelAdmin)
admin.site.register(InfoValue, InfoValueModelAdmin)
