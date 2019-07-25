from django.apps import AppConfig


class PosConfig(AppConfig):
    name = 'pos'

    def ready(self):
        import pos.signals
