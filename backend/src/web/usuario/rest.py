# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb


class Usuario(ndb.Model):
    firstname = ndb.StringProperty()
    lastname = ndb.StringProperty()
    sex = ndb.StringProperty()
    country = ndb.StringProperty()
    state = ndb.StringProperty()
    city = ndb.StringProperty()
    address = ndb.StringProperty()
    zipcode = ndb.StringProperty()
    phone = ndb.StringProperty()
    email = ndb.StringProperty()
    password = ndb.StringProperty()
    google_id = ndb.StringProperty()

    @classmethod
    def query_by_google(cls, google_id):
        return cls.query(cls.google_id==google_id)

'''
def salvar(firstname, lastname, sex, country, state, city, address, zipcode, phone, email, password):
    user = Usuario(firstname=firstname, lastname=lastname, sex=sex, country=country, state=state, city=city,
                  address=address, zipcode=zipcode, phone=phone, email=email, password=password)
    user.put()

def listar(_resp):
    query = Usuario.query().order(-Usuario.firstname, -Usuario.lastname, -Usuario.sex, -Usuario.country, -Usuario.state,
                                -Usuario.city, -Usuario.address, -Usuario.zipcode, -Usuario.phone, -Usuario.email,
                                -Usuario.password)

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_de_usuarios = [to_dict(c) for c in query.fetch()]
    lista_de_usuarios = json.dumps(lista_de_usuarios)
    _resp.write(lista_de_usuarios)
'''