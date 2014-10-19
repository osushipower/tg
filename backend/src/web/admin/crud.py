# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from web.usuario.rest import Usuario


def index(_write_tmpl):
    query = Usuario.query()
    dct = {'lista_cursos': query.fetch()}
    _write_tmpl('/templates/curso_listar.html', dct)