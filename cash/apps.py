from django.apps import AppConfig


class CashConfig(AppConfig):
    name = 'cash'

    def ready(self):
        import cash.signals
