# -*- coding:utf-8 -*-
"""
Redis的操作
"""
import redis

from kanban.settings import REDIS_CONFIG


redis_client = redis.Redis(host=REDIS_CONFIG['host'], port=REDIS_CONFIG['port'],
                           db=REDIS_CONFIG['db'], password=REDIS_CONFIG['password'])

