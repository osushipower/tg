from base import GAETestCase
from mock.mock import Mock
from web import home
from web import about
from web import tickets
from usuario import rest
from usuario.rest import Usuario

class TemplateTests(GAETestCase):

    def test_tickets(self):
        resp_mock = Mock()
        tickets.index(resp_mock)
        resp_mock.assert_called_once_with('/templates/ingressos.html')

    def test_aboutUs(self):
        resp_mock = Mock()
        about.index(resp_mock)
        resp_mock.assert_called_once_with('/templates/aboutus.html')