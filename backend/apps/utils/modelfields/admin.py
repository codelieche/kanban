from django.contrib import admin

from .models import FieldCategory, FieldInfo, ModelFieldsCategory, ModelFields
# Register your models here.


class FieldCategoryModelAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "description")


class FieldInfoModelAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "cateogry", "description")


class ModelFieldsCategoryModelAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "description")


class ModelFieldsModelAdmin(admin.ModelAdmin):
    list_display = ("id", "app_label", "model", "category", "description")


admin.site.register(FieldCategory, FieldCategoryModelAdmin)
admin.site.register(FieldInfo, FieldInfoModelAdmin)
admin.site.register(ModelFieldsCategory, ModelFieldsCategoryModelAdmin)
admin.site.register(ModelFields, ModelFieldsModelAdmin)
