# coding: utf-8
from __future__ import absolute_import, unicode_literals
import json
from produto.model import Product, Lista, SystemProduct
from usuario.model import Usuario
from estabelecimento.model import Estabelecimento
from estatistica.model import Estatistica
from google.appengine.ext import ndb
from datetime import datetime


def salvar(_resp, nome, marca):
    SystemProduct.create_system_product(nome)
    prod = SystemProduct.get_by_id(nome)
    product = prod.create_product().get()
    product.marca = marca
    key = product.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)


def salvar_lista(_resp, _usuario_logado, lista):
    list_to_save = Lista(localcompra=lista["localcompra"], total=lista["total"], nome=lista["nome"], tipo=lista["tipo"])
    d = datetime.today()
    a = d.year
    m = datetime.strftime(datetime.now(), '%b')
    dia = int(datetime.strftime(datetime.now(), '%d'))
    #print dia

    e = Estatistica.find_by_identifier("statistics")

    for produto in lista["produtos"]:
        s_prod = SystemProduct.get_by_id(produto["id"])
        s_prod.put()
        e.adicionar_prod_estatistica(produto["id"])
        product = s_prod.create_product().get()
        product.marca = produto["brand"]
        product.quantidade = int(produto["quant"])
        product.preco = float(produto["preco"])
        product.put()
        list_to_save.produtos.append(product.key)

    for estab in Estabelecimento.query(Estabelecimento.nome == lista["localcompra"]).fetch():
        estab.check_year_existence(a, m)
        estab.put()

    e.ult_lista = lista["nome"]
    e.ult_usuario = _usuario_logado.firstname
    e.ult_lista_hora = datetime.now().strftime('%H:%M:%S')
    if e.dia_atual != dia:
        e.dia_atual = dia
        e.num_listas_dia = 1
    else:
        e.num_listas_dia = e.num_listas_dia + 1

    if not e.num_listas_total:
        e.num_listas_total = 1
    else:
        e.num_listas_total = e.num_listas_total + 1

    if not e.log_listas:
        e.log_listas = []
        e.log_listas.append([{'lista_nome': lista["nome"], 'lista_local':lista["localcompra"],
                             'lista_total': lista["total"], 'lista_username':_usuario_logado.firstname}])
    else:
        e.log_listas.append([{'lista_nome': lista["nome"], 'lista_local':lista["localcompra"],
                             'lista_total': lista["total"], 'lista_username':_usuario_logado.firstname}])
    e.put()

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
            listas = [lista.get().to_dict() for lista in _usuario_logado.listas]
            response = {}
            response["listas"] = listas
            response["autor"] = _usuario_logado.firstname
            _resp.write(json.dumps(response))


def removerlistasalva(_resp, _usuario_logado, id):
    lista = filter(lambda lista: lista.id() == id, _usuario_logado.listas).pop()
    _usuario_logado.listas.remove(lista)
    for produto in lista.get().produtos:
        produto.delete()
    _usuario_logado.put()
    lista.delete()


def buscarListas(_resp, _usuario_logado):
    usuarios = Usuario.query().fetch()
    listas = []
    for index, usuario in enumerate(usuarios):
        listas.append({})
        listas[index]["usuario"] = usuario.firstname
        listas[index]["listas_usuario"] = [lista.get().to_dict() for lista in usuario.listas]
        listas[index]["data_ingresso"] = usuario.data_ingresso
    _resp.write(json.dumps(listas))


def buscar_produtos_recentes(_resp, nome_produto):
    estabelecimentos = Estabelecimento.query().fetch()

    result = {}

    for estabelecimento in estabelecimentos:
        result[estabelecimento.nome] = 0
        listas_por_estabelecimento = Lista.query(Lista.localcompra == estabelecimento.nome).fetch()
        dia_atual = datetime.now().timetuple().tm_yday
        listas_da_ultima_semana = filter(lambda lista: lista.datacompra.timetuple().tm_yday >= (dia_atual - 7) and \
                                                       lista.datacompra.timetuple().tm_yday <= dia_atual,
                                         listas_por_estabelecimento)

        for lista in listas_da_ultima_semana:
            produtos = ndb.get_multi(lista.produtos)
            produto_procurado = filter(lambda produto: produto.nome == nome_produto, produtos)
            if produto_procurado:
                if result[estabelecimento.nome]:
                    if produto_procurado[0].preco < result[estabelecimento.nome]:
                        result[estabelecimento.nome] = produto_procurado[0].preco
                else:
                    result[estabelecimento.nome] = produto_procurado[0].preco
    _resp.write(json.dumps(result))


def buscar_listas_recentes(_resp, produtos):
    estabelecimentos = Estabelecimento.query().fetch()
    lista_final = {}
    result = {}
    list_prod = []
    for a in produtos:
        list_prod.append(a['nome'])

    for estabelecimento in estabelecimentos:
        lista_final[estabelecimento.nome] = []
        #print estabelecimento.nome
        for dic in list_prod:
            #print dic
            result[dic] = 0
            listas_por_estabelecimento = Lista.query(Lista.localcompra == estabelecimento.nome).fetch()
            dia_atual = datetime.now().timetuple().tm_yday
            listas_da_ultima_semana = filter(lambda lista: lista.datacompra.timetuple().tm_yday >= (dia_atual - 7) and \
                                                           lista.datacompra.timetuple().tm_yday <= dia_atual,
                                             listas_por_estabelecimento)
            for lista in listas_da_ultima_semana:
                produtos = ndb.get_multi(lista.produtos)
                #print produtos
                produto_procurado = filter(lambda produto: produto.nome == dic, produtos)
                #print "Quero ", produto_procurado
                if produto_procurado:
                    if result[dic]:
                        if produto_procurado[0].preco < result[dic]:
                            result[dic] = produto_procurado[0].preco
                    else:
                        result[dic] = produto_procurado[0].preco
            lista_final[estabelecimento.nome].append({dic: result[dic]})
    #print lista_final
    _resp.write(json.dumps(lista_final))


# if produto_procurado[0].preco < result[estabelecimento.nome][produto_procurado[0].nome]: