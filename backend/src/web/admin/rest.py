# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from web.usuario.rest import Usuario

'''
class Curso(ndb.Model):
	firstname = ndb.StringProperty()
	lastname = ndb.StringProperty()
	gender = ndb.StringProperty()
	country = ndb.StringProperty()
	state = ndb.StringProperty()
	city = ndb.StringProperty()
	address = ndb.StringProperty()
	zipcode = ndb.StringProperty()
	phone = ndb.StringProperty()
	email = ndb.StringProperty()
	password = ndb.StringProperty()
'''


def listar(_resp):
    query = Usuario.query().order(-Usuario.firstname, -Usuario.lastname, -Usuario.sex, -Usuario.country, -Usuario.state,
                                  -Usuario.city, -Usuario.address, -Usuario.zipcode, -Usuario.phone, -Usuario.email,
                                  -Usuario.password, -Usuario.key)

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_de_cursos = [to_dict(c) for c in query.fetch()]
    lista_de_cursos = json.dumps(lista_de_cursos)
    _resp.write(lista_de_cursos)

def salvar(_resp, firstname, lastname, sex, country, state, city, address, zipcode, phone, email):
    user = Usuario(firstname=firstname, lastname=lastname, sex=sex, country=country,
                   state=state, city=city, address=address, zipcode=zipcode, phone=phone, email=email)
    key = user.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)


def editar(_resp, idUsuario, firstname, lastname, sex, country, state, city, address, zipcode, phone, email):
    user = Usuario.get_by_id(int(idUsuario))
    user.firstname = firstname
    user.lastname = lastname
    user.sex = sex
    user.country = country
    user.state = state
    user.city = city
    user.address = address
    user.zipcode = zipcode
    user.phone = phone
    user.email = email

    user.put()

def remover(_resp, idUsuario):
    user = Usuario.get_by_id(int(idUsuario))
    user.key.delete()