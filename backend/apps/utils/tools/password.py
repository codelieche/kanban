# -*- coding:utf-8 -*-
"""
密码相关的工具
1. random_password: 随机生成一个密码（默认16位）
2. Cryptography: 对称加密
"""
import random
import string
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex

from django.conf import settings


def random_password(length=16):
    """
    随机获取N位密码
    :param length: 密码长度，默认16位
    :return: length位字符
    """
    strings = string.ascii_letters + string.digits
    # 方式一：
    # password = ''.join(random.SystemRandom().choice(strings) for _ in range(length))

    # 方式二：
    password = ''.join(random.sample(strings, length))
    return password


class Cryptography:
    """
    对称加密
    Symetric Cryptography
    """
    # def __init__(self, key):
    def __init__(self, key=settings.PASSWORD_KEY):
        # key必须是字符串格式的
        key = str(key)
        self.key = key
        # 注意秘钥是需要16位的，如果大于16位就截取前面十六位
        if len(key) > 16:
            self.key = key[0:16]
        if len(key) < 16:
            self.key = key + (16 - len(key)) * '.'
        self.mode = AES.MODE_CBC

    def encrypt(self, text):
        """加密操作"""
        cryptor = AES.new(self.key, self.mode, '0000000000000000')
        length = 16
        count = len(text)
        if count < length:
            add = (length - count)
            text = text + (' ' * add)
        elif count > length:
            add = (length - (count % length))
            text = text + (' ' * add)

        ciphertext = cryptor.encrypt(text)
        return b2a_hex(ciphertext).decode()

    def decrypt(self, text):
        """解密操作"""
        cryptor = AES.new(self.key, self.mode, "0000000000000000")
        plain_text = cryptor.decrypt(a2b_hex(text)).decode()
        return plain_text.strip(' ')

    def check_can_decrypt(self, value):
        """
        判断value是否是加密后的值
        """
        try:
            de_p = self.decrypt(value)
            return True, de_p
        except ValueError:
            return False, None
        except Exception as e:
            print('解密错误：', e)
            return False, None


if __name__ == '__main__':
    k = random_password(16)
    print("key is ", k)
    p = Cryptography(k)
    # 加密操作
    en_p = p.encrypt('codelieche')
    print(en_p)
    # 解密操作
    de_p = p.decrypt(en_p)
    print(de_p)
