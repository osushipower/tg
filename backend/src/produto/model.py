# -*- coding: utf-8 -*-

from __future__ import absolute_import, unicode_literals
import json
import datetime
from google.appengine.ext import ndb


class Product(ndb.Model):
    nome = ndb.StringProperty(required=True)
    marca = ndb.StringProperty()
    quantidade = ndb.IntegerProperty(default=0)
    preco = ndb.FloatProperty(default=0)
    valor_total = ndb.ComputedProperty(lambda self: self.quantidade * self.preco)

    def to_dict(self):
        dic = super(Product, self).to_dict()
        dic["preco"] = " %4.2f" %self.preco
        return dic

class SystemProduct(ndb.Model):
    brands = ndb.StringProperty(repeated=True)

    @classmethod
    def create_system_product(cls, id, brand=None):

        #import pdb; pdb.set_trace()
        def _set_brands(s_product, brand):
            if brand is not None:
                if brand not in s_product.brands:
                    s_product.brands.append(brand)
                    return None
                else:
                    return u"Essa marca já está cadastrada no produto"

        system_product = cls.get_by_id(id)

        if system_product is not None:
            err = _set_brands(system_product, brand)
            system_product.put()
            return system_product, err
        else:
            system_product = SystemProduct(id=id)
            err = _set_brands(system_product, brand)
            system_product.put()
            return system_product, err

    def create_product(self, **kwargs):
        return Product(nome=self.key.id(), **kwargs).put()


class Lista(ndb.Model):
    nome = ndb.StringProperty(required=True, default=datetime.datetime.now().strftime("%Y-%b-%d %H:%M"))
    produtos = ndb.KeyProperty(repeated=True)
    localcompra = ndb.StringProperty()
    datacompra = ndb.DateProperty(auto_now=True)
    total = ndb.FloatProperty(required=True)

    def to_dict(self):
        return {
            "nome": self.nome,
            "produtos": [produto.get().to_dict() for produto in self.produtos],
            "localcompra": self.localcompra,
            "datacompra": self.datacompra.strftime("%Y-%b-%d"),
            "total": self.total,
            "id": self.key.id()
        }

