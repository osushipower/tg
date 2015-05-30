# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb
from datetime import datetime

class Estatistica(ndb.Model):
    identifier = ndb.StringProperty()
    ult_lista = ndb.StringProperty()
    ult_usuario = ndb.StringProperty()
    ult_lista_hora = ndb.StringProperty()
    prod_mais_add = ndb.JsonProperty()
    log_listas = ndb.JsonProperty()
    num_listas_dia = ndb.IntegerProperty()
    num_listas_total = ndb.IntegerProperty()
    dia_atual = ndb.IntegerProperty()

    @classmethod
    def find_by_identifier(cls, identifier):
        obj = cls.query(cls.identifier==identifier).get()
        if obj is None:
            return cls(identifier=identifier).put().get()
        return obj

    def adicionar_prod_estatistica(self, prod_nome):
        encontrei = False
        if not self.prod_mais_add:
            self.prod_mais_add = []
            self.prod_mais_add.append({prod_nome: 1})
            print 'Nada na lista, criei uma nova e add o prod'
        else:
            for i in self.prod_mais_add:
                if prod_nome in i:
                    encontrei = True
                    i[prod_nome] = i[prod_nome] + 1
            if encontrei == False:
                self.prod_mais_add.append({prod_nome: 1})

