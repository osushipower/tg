from __future__ import absolute_import, unicode_literals
import tmpl_middleware
from tekton.gae.middleware import router_middleware, parameter, webapp2_dependencies, email_errors
from usuario import middleware

APP_URL = 'https://projetolistacompras.appspot.com'
SENDER_EMAIL = 'eduardothewriter2@gmail.com'
DEFAULT_LOCALE = 'pt_BR'
DEFAULT_TIMEZONE = 'America/Sao_Paulo'
LOCALES = ['en_US', 'pt_BR']
TEMPLATE_404_ERROR = 'base/home.html'
TEMPLATE_400_ERROR = 'base/home.html'
MIDDLEWARES = [middleware.execute,
               tmpl_middleware.execute,
               email_errors.execute,
               webapp2_dependencies.execute,
               parameter.execute,
               router_middleware.execute]


''' -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import tmpl_middleware
from tekton.gae.middleware import router_middleware, parameter, webapp2_dependencies, email_errors
from web.usuario import middleware

SENDER_EMAIL = 'eduardothewriter2@gmail.com'
WEB_BASE_PACKAGE = "web"


'''