# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

import unittest
import os
from google.appengine.ext import testbed

LOGGED_GOOGLE_USER_MAIL = 'test@gmail.com'
LOGGED_GOOGLE_USER_ID = '123'

os.environ['AUTH_DOMAIN'] = "balh"
os.environ['USER_EMAIL'] = LOGGED_GOOGLE_USER_MAIL
os.environ['USER_ID'] = LOGGED_GOOGLE_USER_ID
os.environ['USER_IS_ADMIN'] = "1"
os.environ['TESTING'] = "1"


class GAETestCase(unittest.TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.setup_env(app_id="_")
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_user_stub()
        self.testbed.init_urlfetch_stub()
        self.testbed.init_memcache_stub()
        self.testbed.init_mail_stub()
        self.testbed.init_taskqueue_stub()
        self.testbed.init_search_stub()
        self.testbed.init_blobstore_stub()
        self.testbed.init_channel_stub()
