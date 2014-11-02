from __future__ import absolute_import, unicode_literals
import json
from ..produto.rest import Produto

def salvar(_resp, nome, marca):
    prod = Produto(nome = nome, marca = marca)
    key = prod.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)

def listar(_resp):
    query = Produto.query().order(-Produto.nome, -Produto.marca)

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_de_produtos = [to_dict(c) for c in query.fetch()]
    lista_de_produtos = json.dumps(lista_de_produtos)
    _resp.write(lista_de_produtos)

def remover(_resp, idProduto):
    prod = Produto.get_by_id(int(idProduto))
    prod.key.delete()