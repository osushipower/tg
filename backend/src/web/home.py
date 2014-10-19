# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import webapp2
from web import my_form
from tekton import router
from google.appengine.api import users


def index(_write_tmpl):
    user = users.get_current_user()

    if user:
        _write_tmpl('templates/index.html', {'name': user.nickname(), "logout": users.create_logout_url("/")})
    else:
        _write_tmpl('templates/index.html', {"login": users.create_login_url("/")})


def params(_resp, *args, **kwargs):
    _resp.write(args)
    _resp.write(kwargs)