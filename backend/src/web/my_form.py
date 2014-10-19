# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals


def index(_write_tmpl,_req, name):

    _write_tmpl('templates/curso_form.html', {'name': name,'req':_req})