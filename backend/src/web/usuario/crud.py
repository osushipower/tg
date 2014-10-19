# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from tekton import router
from web.usuario.rest import Usuario


def index(_write_tmpl):
    query = Usuario.query()
    dct = {'lista_cursos': query.fetch()}
    _write_tmpl('/templates/curso_listar.html', dct)


def cadastrar(_write_tmpl, _req):
    path = router.to_path(salvar)
    dct = {'salvar_curso': path, 'req': _req}
    _write_tmpl('/templates/curso_form.html', dct)

def salvar(_handler, firstname, lastname, sex, country, state, city, address, zipcode, phone, email, password):
    user = Usuario(firstname=firstname, lastname=lastname, sex=sex, country=country, state=state, city=city,
                  address=address, zipcode=zipcode, phone=phone, email=email, password=password)
    user.put()
    path = router.to_path(index)
    _handler.redirect(path)
