from __future__ import absolute_import, unicode_literals
import json
from ..produto.rest import Produto

def salvar(_resp, nome, marca):
    prod = Produto(nome = nome, marca = marca)
    key = prod.put()
    json_str = json.dumps({'id': key.id()})
    _resp.write(json_str)