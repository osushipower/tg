# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb


class Produto(ndb.Model):
    nome = ndb.StringProperty()
    marca = ndb.StringProperty()

class RProdutoXLista(ndb.Model):
    produto = ndb.KeyProperty()
    preco = ndb.FloatProperty()
    quant = ndb.IntegerProperty()
    total = ndb.FloatProperty()
    localcompra = ndb.StringProperty()
    autor = ndb.StringProperty()
    datacompra = ndb.DateTimeProperty(auto_now=True)