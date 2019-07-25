#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import webbrowser
from threading import Timer
from cefpython3 import cefpython as cef
import sys
import platform
import portend

os.environ["DJANGO_SETTINGS_MODULE"] = "caretaker.settings"

import cherrypy
import django
django.setup()
from django.conf import settings
from django.core.handlers.wsgi import WSGIHandler

def open_browser(host,port):
    sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
    cef.Initialize()
    cef.CreateBrowserSync(url="http://{}:{}/".format(host,port), window_title="Caretaker")
    cef.MessageLoop()
    cef.Shutdown()

class DjangoApplication(object):
    HOST = "127.0.0.1"
    PORT = 8000
    browsers = ['chrome','google-chrome','firefox','mozilla','windows-default']
    browser = ''
    def mount_static(self, url, root):
        """
        :param url: Relative url
        :param root: Path to static files root
        """
        config = {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': root,
            'tools.expires.on': True,
            'tools.expires.secs': 86400
        }
        cherrypy.tree.mount(None, url, {'/': config})

    def open_browser(self):
        webbrowser._tryorder = self.browsers
        browser = webbrowser.get()
        self.browser = browser.basename
        Timer(5, browser.open_new, ("http://%s:%s" % (self.HOST, self.PORT),)).start()

    def run(self):
        try:
            portend.Checker().assert_free(self.HOST,port=self.PORT)
            cherrypy.config.update({
                'server.socket_host': self.HOST,
                'server.socket_port': self.PORT,
                'engine.autoreload_on': False,
                'log.screen': True
            })
            self.mount_static(settings.STATIC_URL,settings.STATIC_ROOT)

            cherrypy.log("Loading and serving Django application")
            cherrypy.tree.graft(WSGIHandler())
            cherrypy.engine.start()

            open_browser(self.HOST,self.PORT)

            cherrypy.engine.block()
        except portend.PortNotFree:
            open_browser(self.HOST,self.PORT)

if __name__ == "__main__":
    DjangoApplication().run()
