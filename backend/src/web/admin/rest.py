from __future__ import absolute_import, unicode_literals
import json
from produto.model import Product, Lista, SystemProduct
from estabelecimento.model import Estabelecimento
from google.appengine.ext import ndb
from datetime import datetime

def salvarProdutoSistema(_resp, nome, marca):
    s_product, error = SystemProduct.create_system_product(nome, marca)
    prod = SystemProduct.get_by_id(nome)
    json_str = json.dumps({'id': prod.key.id(), "brands": prod.brands, "error": error if error is not None else ""})
    _resp.write(json_str)


def listarProdutosSistema(_resp):
    query = SystemProduct.query()

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_de_s_produtos = [c for c in query.fetch()]
    lista_de_s_produtos = json.dumps([to_dict(c) for c in lista_de_s_produtos])
    _resp.write(lista_de_s_produtos)


def removerProdutoSistema(_resp, name):
    s_product = SystemProduct.get_by_id(name)
    s_product.key.delete()


def salvarEstab(_resp, nome):
    e = Estabelecimento(nome=nome)
    key = e.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)


def listarEstabelecimentos(_resp):
    query = Estabelecimento.query().order(-Estabelecimento.nome, -Estabelecimento.rate, -Estabelecimento.comentarios)

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_de_estabelecimentos = [to_dict(c) for c in query.fetch()]
    lista_de_estabelecimentos = json.dumps(lista_de_estabelecimentos)
    _resp.write(lista_de_estabelecimentos)


def removerEstab(_resp, idEstab):
    estab = Estabelecimento.get_by_id(int(idEstab))
    estab.key.delete()
