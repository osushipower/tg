# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb


class Produto(ndb.Model):
    nome = ndb.StringProperty()
    marca = ndb.StringProperty()