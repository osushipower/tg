# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb
from datetime import date


class Estabelecimento(ndb.Model):
    global info_estab

    nome = ndb.StringProperty()
    rate = ndb.IntegerProperty()
    comentarios = ndb.StringProperty()
    info_estab = [{'Ano': date.today().year, 'Months':{'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0,
                    'Jun': 0, 'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0}}]
    @classmethod
    def check_year_existence(cls, ano, mes):
        for dic in info_estab:
            ano_dic = dic.get('Ano')
            meses = dic.get('Months')
            if ano_dic and ano_dic == ano:
                for m in meses:
                    if m == mes:
                        meses[m] += 1
            else:
                ano_atual = date.today().year
                mes_atual = date.strftime(date.now(), '%b')
                info_estab.append({'Ano': date.today().year, 'Months':{'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0,
                    'Jun': 0, 'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0}})
                cls.check_year_existence(ano_atual, mes_atual)