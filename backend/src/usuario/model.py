# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
from google.appengine.ext import ndb


class Usuario(ndb.Model):
    firstname = ndb.StringProperty()
    lastname = ndb.StringProperty()
    city = ndb.StringProperty()
    email = ndb.StringProperty()
    password = ndb.StringProperty()
    google_id = ndb.StringProperty()
    listas = ndb.KeyProperty(repeated=True)

    @classmethod
    def query_by_google(cls, google_id):
        return cls.query(cls.google_id == google_id)

    @classmethod
    def get_by_user(cls, user_id):
        user = Usuario.get_by_id(long(user_id))
        query = cls.query(cls.user_key == user.key)

        return query.get()
