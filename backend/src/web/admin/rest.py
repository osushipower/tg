from __future__ import absolute_import, unicode_literals
import json
from produto.model import Product, Lista, SystemProduct
from estabelecimento.model import Estabelecimento
from estatistica.model import Estatistica
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


def listarEstatisticas(_resp):
    query = Estabelecimento.query()

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_estatistica = [to_dict(c) for c in query.fetch()]
    # lista_estatistica = json.dumps(lista_estatistica)
    _resp.write(json.dumps(lista_estatistica))


def listarEstatisticasProdutos(_resp):
    query = SystemProduct.query()

    def to_dict(c):
        dct = c.to_dict()
        dct['id'] = str(c.key.id())
        return dct

    lista_estatistica_produtos = [to_dict(c) for c in query.fetch()]
    # lista_estatistica = json.dumps(lista_estatistica)
    _resp.write(json.dumps(lista_estatistica_produtos))


def printar_Estatistica_Sistema(_resp):
    e = Estatistica.find_by_identifier("statistics")
    dia = int(datetime.strftime(datetime.now(), '%d'))
    #print dia
    if e.dia_atual != dia:
        e.dia_atual = dia
        e.num_listas_dia = 0
        e.put()
    _resp.write(json.dumps(e.log_listas))


def listas_Estatisticas_Gerais(_resp):
    e = Estatistica.find_by_identifier("statistics")
    list_estat = {'ult_lista': e.ult_lista, 'ult_usuario': e.ult_usuario, 'ult_lista_hora': e.ult_lista_hora,
                  'num_listas_dia': e.num_listas_dia, 'num_listas_total': e.num_listas_total,
                  'dia_atual': e.dia_atual, 'prod_mais_add': e.prod_mais_add}
    _resp.write(json.dumps(list_estat))


def buscar_produtos_recentes(_resp, nome_produto):
    estabelecimentos = Estabelecimento.query().fetch()

    result = {}

    for estabelecimento in estabelecimentos:
        result[estabelecimento.nome] = 0
        listas_por_estabelecimento = Lista.query(Lista.localcompra == estabelecimento.nome).fetch()

        for lista in listas_por_estabelecimento:
            produtos = ndb.get_multi(lista.produtos)
            produto_procurado = filter(lambda produto: produto.nome == nome_produto, produtos)
            if produto_procurado:
                if result[estabelecimento.nome]:
                    result[estabelecimento.nome] = result[estabelecimento.nome] + 1
                else:
                    result[estabelecimento.nome] = 1
    _resp.write(json.dumps(result))