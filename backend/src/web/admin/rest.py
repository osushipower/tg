from __future__ import absolute_import, unicode_literals
import json
from produto.model import Produto, RProdutoXLista
from estabelecimento.model import Estabelecimento
from usuario.model import RUsuarioXLista
from google.appengine.ext import ndb


def salvar(_resp, nome, marca):
    prod = Produto(nome=nome, marca=marca)
    key = prod.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)


def listarProdutos(_resp):
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


def salvar_lista(_resp, _usuario_logado, *args, **kwargs):
    list_keys = []
    if u'list' in kwargs:
        for item in kwargs[u'list']:
            item['produto'] = Produto.get_by_id(long(item["id"])).key
            item.pop('id')
            item['autor'] = _usuario_logado.firstname
            item.pop('autor')
            list_key = RProdutoXLista(**item).put()
            list_keys.append(list_key)
        RUsuarioXLista(user_key=_usuario_logado.key, list_key=list_keys).put()


def exibirlistasalvas(_resp):
    listas_bd = RProdutoXLista.query().fetch()
    _resp.write(listas_bd)


def exibirlistasusuario(_resp, _usuario_logado):
    tempPxL = RProdutoXLista.query().fetch()
    _resp.write(tempPxL)


def removerlistasalva(_resp, idLista):
    l = RProdutoXLista.get_by_id(int(idLista))
    lu = RUsuarioXLista.get_by_id()
    l.key.delete()


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


