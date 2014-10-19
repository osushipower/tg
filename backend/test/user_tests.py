__author__ = 'Aluno_Enfase'

from base import GAETestCase
from web.admin import rest
from web.usuario.rest import Usuario
from mock.mock import Mock
from google.appengine.ext import ndb

class RestTests(GAETestCase):
    def test_salvar(self):
        resp = Mock()
        rest.salvar(resp, 'maria', 'mariazinha', 'F', 'BR',
                    'SP', 'SJC', 'rua das marias', '12222-222',
                    '3200-0000', 'maria@maria.com')
        lista = Usuario.query().fetch()
        self.assertEquals(1, len(lista))
        usuario = lista[0]
        self.assertEqual('maria', usuario.firstname)
        self.assertEqual('maria@maria.com', usuario.email)

    def test_listar(self):
        usuarios = [Usuario(firstname='Teste1', lastname='Teste1', sex='M', country='BR',
                            state='SP', city='SJC', address='Rua dos Testes', zipcode='00000-000',
                            phone='1234-5678', email='teste1@testemail.com'),
                    Usuario(firstname='Teste2', lastname='Teste2', sex='M', country='BR',
                            state='SP', city='SJC', address='Rua dos Testes', zipcode='00000-000',
                            phone='1234-5678', email='teste2@testemail.com')]
        ndb.put_multi(usuarios)
        resp = Mock()
        rest.listar(resp)
        resp.write.assert_called_once_with('[{"city": "SJC", "google_id": null, "firstname": "Teste2", "lastname": "Teste2", "address": "Rua dos Testes", "zipcode": "00000-000", "sex": "M", "phone": "1234-5678", "state": "SP", "country": "BR", "id": "1", "password": null, "email": "teste2@testemail.com"},'
                                           ' {"city": "SJC", "google_id": null, "firstname": "Teste1", "lastname": "Teste1", "address": "Rua dos Testes", "zipcode": "00000-000", "sex": "M", "phone": "1234-5678", "state": "SP", "country": "BR", "id": "2", "password": null, "email": "teste1@testemail.com"}]')