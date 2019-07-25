from django.apps import AppConfig


class PopConfig(AppConfig):
    name = 'pop'

    def ready(self):
        import pop.signals
