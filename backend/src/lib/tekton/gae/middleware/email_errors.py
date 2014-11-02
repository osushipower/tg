# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import json
import logging
import traceback
import time

from google.appengine.api import app_identity, mail, capabilities
from google.appengine.runtime import DeadlineExceededError

from tekton.router import PathNotFound


def get_apis_statuses(e):
    if not isinstance(e, DeadlineExceededError):
        return {}
    t1 = time.time()
    statuses = {
        'blobstore': capabilities.CapabilitySet('blobstore').is_enabled(),
        'datastore_v3': capabilities.CapabilitySet('datastore_v3').is_enabled(),
        'datastore_v3_write': capabilities.CapabilitySet('datastore_v3', ['write']).is_enabled(),
        'images': capabilities.CapabilitySet('images').is_enabled(),
        'mail': capabilities.CapabilitySet('mail').is_enabled(),
        'memcache': capabilities.CapabilitySet('memcache').is_enabled(),
        'taskqueue': capabilities.CapabilitySet('taskqueue').is_enabled(),
        'urlfetch': capabilities.CapabilitySet('urlfetch').is_enabled(),
        }
    t2 = time.time()
    statuses['time'] = t2 - t1
    return statuses


def execute(next_process, handler, dependencies, **kwargs):
    try:
        next_process(dependencies, **kwargs)
    except PathNotFound, e:
        handler.response.set_status(404)

    except BaseException, e:
        handler.response.status_code = 400
   
