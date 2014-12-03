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
            list_key = RProdutoXLista(**item).put()
            list_keys.append(list_key)
        #  pego a lista do usuario
        usuario_lista = RUsuarioXLista.get_by_user(_usuario_logado.key.id())

        if usuario_lista  is None:
        	#  se ela nao existo eu crio uma
        	usuario_lista = RUsuarioXLista(user_key=_usuario_logado.key, list_key=list_keys)
        else:
        	#  se existe eu adiciono list_keys na lista de chaves
        	usuario_lista.list_key.extend(list_keys)
        # salvo a lista
        usuario_lista.put()


def exibirlistasalvas(_resp):
    listas_bd = RProdutoXLista.query().fetch()
    _resp.write(listas_bd)


def exibirlistasusuario(_resp, _usuario_logado):

	#  campos para excluir do  to_dict do RProdutoXLista
	fields_to_exclude = ["produto", "preco", "quant", "total", "localcompra", "autor"]
	# busco a RUsuarioXLista do usuario
	usuario_lista = RUsuarioXLista.get_by_user(_usuario_logado.key.id())
	#  encontro todas as RProdutoXLista da lista do usuario
	listas = ndb.get_multi([lista for lista in usuario_lista.list_key])
	# gero uma lista de dicionarios excluindo os campos em fields_to_exclude
	# isso deixa apenas datacompra e autor
	listas = [lista.to_dict(exclude=fields_to_exclude) for lista in listas]
	response = {}
	response["listas"] = listas
	response["autor"] = _usuario_logado.firstname
	_resp.write(response)


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


