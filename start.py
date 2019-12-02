import os
import sys
from multiprocessing import Process
from subprocess import run
from cefpython3 import cefpython as cef

def open_cef():
	
	sys.excepthook = cef.ExceptHook
	cef.Initialize()
	cef.CreateBrowserSync(url='http://127.0.0.1:8000', window_title='Welcome to RxPoint')
	cef.MessageLoop()


try:
	dj = Process(target=run, args=(['python3','manage.py', 'runserver'],))
	dj.start()
	dj.join(5)
except:
	pass
finally:
	p = Process(target=open_cef)
	p.start()
	p.join()


