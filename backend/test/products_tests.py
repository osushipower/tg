# coding: utf-8

import unittest
from produto.model import SystemProduct, Product, Lista
from google.appengine.ext import ndb
from base import GAETestCase


class RestTests(GAETestCase):
    def setUp(self):
        super(RestTests, self).setUp()
        self.system_product = SystemProduct.create_system_product("café")

    def test_save_system_product(self):
        lista = Lista(nome="minha lista")
        lista.put()

        product = SystemProduct.get_by_id("café")

        user_product = product.create_product().get()
        lista.produtos.append(user_product)

        user_product.marca = "pilão"

        self.assertEquals(lista.produtos[0].marca, "pilão")


    def test_get_system_product(self):
        s_product = SystemProduct.get_by_id("feijão")

        self.assertIsNone(s_product)

        SystemProduct.create_system_product("feijão")
        s_product = SystemProduct.get_by_id("feijão")

        self.assertIsNotNone(s_product)


    def test_create_list(self):
        lista = Lista(nome="minha lista")
        lista.put()

        s_product = SystemProduct.get_by_id("café")
        u_product = s_product.create_product().get()
        lista.produtos.append(u_product)

        self.assertEquals(u_product.nome, u"café")
        self.assertEquals(u_product.marca, None)

        lista.produtos[0].marca = "pilão"
        lista.produtos[0].quantidade = 10
        lista.produtos[0].preco = 5.00

        self.assertEquals(u_product.valor_total, 50.00)
