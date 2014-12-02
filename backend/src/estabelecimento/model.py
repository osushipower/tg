# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb


class Estabelecimento(ndb.Model):
    nome = ndb.StringProperty()
    rate = ndb.IntegerProperty()
    comentarios = ndb.StringProperty()