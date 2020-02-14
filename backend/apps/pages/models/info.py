"""
页面属性相关的Model
"""
from django.db import models

from pages.models.page import Page

# 属性值可能是个字符，也可能是个数值，也可能是个json对象
VALUE_TYPE_CHOICES = (
    ("text", "文本"),
    ("number", "数字类型"),
    ("bool", "布尔类型"),
    ("json", "Json对象") # 当分类中fields有多个就是json类型。
)


class InfoField(models.Model):
    """字段"""
    name = models.SlugField(verbose_name="字段名", max_length=20)
    name_verbose = models.CharField(verbose_name="字段名(中文)", max_length=40)
    is_active = models.BooleanField(verbose_name="有效", blank=True, default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "字段"
        verbose_name_plural = verbose_name


class InfoCategory(models.Model):
    """
    属性的分类
    """
    # 元素的类型
    ELEMENT_CHOICES = (
        ("text", "文本"),         # 文本：默认的类型，输入字符即可
        ("number", "数值"),       # 数值：支持整数和浮点数
        ("select", "单选"),       # 单选
        ("tags", "标签"),         # 多选：标签的类型，一个page可以有多个标签值
        ("checkbox", "复选框"),   # checkbox: 选中或者不选中
        ("date", "日期"),         # 日期有开始和一个结束
        ("user", "用户"),         # 设置: 执行用户啊等，和tag一样是可以设置多个值的
        ("file", "文件"),         # 文件：可以是个链接，也可以上传
        ("image", "图片"),        # 图片：可以是个url，也可以是个文件
        ("viedio", "视频"),       # 视频：可以是url，也可以自己上传
        ("url", "链接"),          # 链接：点击后可以跳转到新的页面
        ("email", "邮箱"),        # 邮箱：
        ("phone", "电话")         # 电话：需要校验
    )
    name = models.CharField(verbose_name="类型名", max_length=40, unique=True)
    icon = models.SlugField(verbose_name="分类图标", max_length=40, blank=True)
    element = models.CharField(verbose_name="元素", choices=ELEMENT_CHOICES,
                               default="text", max_length=40, blank=True)
    # date类型的有个start和end字段，其它的都只一个value字段
    fields = models.ManyToManyField(to=InfoField, blank=True, verbose_name="信息字段")
    order = models.SmallIntegerField(verbose_name="排序", default=1, blank=True)
    is_active = models.BooleanField(verbose_name="有效", default=True, blank=True)

    class Meta:
        verbose_name = "属性类型"
        verbose_name_plural = verbose_name


class Info(models.Model):
    """属性"""

    category = models.ForeignKey(to=InfoCategory, verbose_name="分类",
                                 blank=False, on_delete=models.CASCADE)
    name = models.CharField(verbose_name="属性名", max_length=40, blank=True, default="属性", db_index=True)
    # 这个属性属于哪个页面
    page = models.ForeignKey(to=Page, verbose_name="页面", related_name="infos", 
                             on_delete=models.CASCADE)
    value_type = models.CharField(verbose_name="值类型", max_length=40, choices=VALUE_TYPE_CHOICES, 
                                  default="text", blank=True)
    order = models.SmallIntegerField(verbose_name="排序", default=1, blank=True)
    # 只有category__element是tags类型的值，才可以有多个值，其它每个page只能设置单值
    is_multiple = models.BooleanField(verbose_name="是否有多值", default=False, blank=True)
    is_active = models.BooleanField(verbose_name="有效", default=True, blank=True)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        # 根据分类的element类型，来设置is_multiple
        if self.category.element in ("tags", "user"):
            self.is_multiple = True
        else:
            self.is_multiple = False
        # 判断值的类型：保存的方式都是字符串，但是前端需要个根据这些值来做处理
        if self.category.element == "number":
            self.value_type = "number"
        elif self.category.element in ("date", ):
            # date类型的会有两个字段：start和value
            self.value_type = "json"
        elif self.category.element in ("checkbox",):
            self.value_type = "bool"
        
        super().save(force_insert=force_insert, force_update=force_update, 
                     using=using, update_fields=update_fields)

    class Meta:
        verbose_name = "属性"
        verbose_name_plural = verbose_name


class InfoValue(models.Model):
    """属性的值"""
    info = models.ForeignKey(to=Info, verbose_name="属性", on_delete=models.CASCADE, 
                             related_name="values")
    pages = models.ManyToManyField(to=Page, verbose_name="页面")
    value = models.CharField(verbose_name="值", max_length=512)
    value_type = models.CharField(verbose_name="值类型", default="text", blank=True,
                                  max_length=40, choices=VALUE_TYPE_CHOICES)
    order = models.PositiveSmallIntegerField(verbose_name="排序", default=1, blank=True)
    color = models.CharField(verbose_name="颜色", max_length=40, blank=True, null=True)
    is_active = models.BooleanField(verbose_name="有效", blank=True, default=True)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        # 修改value_type
        self.value_type = self.info.value_type

        super().save(force_insert=force_insert, force_update=force_update, 
                     using=using, update_fields=update_fields)
        
    class Meta:
        verbose_name = "属性值"
        verbose_name_plural = verbose_name
