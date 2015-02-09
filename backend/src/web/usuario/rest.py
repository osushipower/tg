# coding: utf-8

from __future__ import absolute_import, unicode_literals
import json
from produto.model import Product, Lista, SystemProduct
from usuario.model import Usuario
from estabelecimento.model import Estabelecimento
from google.appengine.ext import ndb


def salvar(_resp, nome, marca):
    SystemProduct.create_system_product(nome)
    prod = SystemProduct.get_by_id(nome)
    product = prod.create_product().get()
    product.marca = marca
    key = product.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)


def salvar_lista(_resp, _usuario_logado, lista):
    list_to_save = Lista(localcompra=lista["localcompra"], total=lista["total"])

    for produto in lista["produtos"]:
        s_prod = SystemProduct.get_by_id(produto["id"])
        product = s_prod.create_product().get()
        product.marca = produto["brand"]
        product.quantidade  =  produto["quant"]
        product.preco =  produto["preco"]
        product.put()
        list_to_save.produtos.append(product.key)

    list_to_save.put()
    _usuario_logado.listas.append(list_to_save.key)
    _usuario_logado.put()

def listarProdutos(_resp):
    query = Product.query().order(-Product.nome, -Product.marca)

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_de_Products = [to_dict(c) for c in query.fetch()]
    lista_de_Products = json.dumps(lista_de_Products)
    _resp.write(lista_de_Products)

def remover(_resp, idProduct):
    prod = Product.get_by_id(idProduct)
    prod.key.delete()

def exibirlistasalvas(_resp):
    listas_bd = Lista.query().fetch()
    _resp.write(listas_bd)


def exibirlistasusuario(_resp, _usuario_logado):
    if _usuario_logado:
        if _usuario_logado.listas is not None:
            listas = sorted( ndb.get_multi(_usuario_logado.listas), key=lambda lista:lista.datacompra)
            response = {}
            response["listas"] = [lista.to_dict() for lista in listas]
            response["autor"] = _usuario_logado.firstname
            _resp.write(json.dumps(response))


def removerlistasalva(_resp, _usuario_logado, id):

    lista = filter(lambda lista: lista.id()==id, _usuario_logado.listas)
    if lista:
        lista = lista[0]
        _usuario_logado.listas.remove(lista)
        for produto in lista.get().produtos:
            produto.delete()
        _usuario_logado.put()
        lista.delete()

def buscarListas(_resp):
    usuarios = Usuario.query().fetch()
    listas = []
    for index, usuario in enumerate(usuarios):
        listas.append({})
        listas[index]["usuario"] = usuario.firstname
        listas[index]["listas_usuario"] = [lista.get().to_dict() for lista in usuario.listas]
    _resp.write(json.dumps(listas))
