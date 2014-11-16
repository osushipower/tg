from google.appengine.ext import ndb

class ListaCompras(ndb.Model):

    autor = ndb.StringProperty
    datacriacao = ndb.DateProperty(auto_now_add=True)

