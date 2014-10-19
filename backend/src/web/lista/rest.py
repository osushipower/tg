from google.appengine.ext import ndb


class Produto(ndb.Model):
    nome = ndb.StringProperty()
    marca = ndb.StringProperty()
    tipo = ndb.StringProperty()
    preco = ndb.FloatProperty()
    quant = ndb.IntegerProperty()


class ListaCompras(ndb.Model):
    itens =
    autor = ndb.StringProperty
    datacriacao = ndb.DateProperty(auto_now_add=True)
