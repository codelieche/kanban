"""
发送消息
"""
from account.models import Message, MessageScope, User


def send_dingding_message(user, message, link=None):
    """
    发送钉钉消息
    :param user:  接收消息的用户 list或逗号分隔的字符串
    :param message: 消息内容
    :param link: 链接
    :return:
    """
    print(user, message, link)
    # 暂时还未实现


# 发送消息
def send_message(user, title, content, link=None, scope='default', sender='system',
                 website=True, dingding=False):
    """
    发送站内信
    :param user: account.User对象
    :param title: 消息标题
    :param content: 消息内容
    :param link: 消息链接
    :param scope: 消息范围，默认：default
    :param sender: 发送者，字符串型，默认：system
    :param website: 是否发站内信，默认：True
    :param dingding: 是否发送钉钉信息，默认：False
    :return: 成功返回True、False
    """
    # 第1步：确定user，如果user是字符串，就获取到相应用户
    if isinstance(user, str):
        user = User.objects.filter(username=user).first()
        if not user:
            return False
    if isinstance(sender, User):
        sender = User.username

    # 第2步：创建站内信
    if website:
        try:
            scope, created = MessageScope.objects.get_or_create(scope=scope.strip())
            Message.objects.create(user=user, sender=sender, scope=scope,
                                   title=title, content=content, link=link)
        except Exception:
            return False

    # 第3步：是否发送钉钉消息
    if dingding:
        # print("发送钉钉消息")
        return send_dingding_message(user=user.username, message=content, link=link)
    return True
