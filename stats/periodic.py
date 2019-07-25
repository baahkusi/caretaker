import datetime
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum,F,FloatField
from custom.views import JSONQueryView
from stats.helpers import day_of_year,week_of_year,filter_keys

MONTHS = ['January','Febuary','March','April','May','June','July','August','September','October','November','December']

class DailyRecord(JSONQueryView):
    accept_arg = True

    def make_query(self,ask=None):
        data = []
        record = self.model.objects.all().dates('timestamp','day')
        if 'start' in ask.keys() and 'end' in ask.keys():
            start = ask['start']
            end = ask['end']
            record = record.filter(timestamp__range=(start,end))

        for day in sorted(list(record), reverse=True):
            records = self.model.objects.filter(timestamp__date=day)
            records = filter_keys(ask,records,rangeless=True)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))

            if not records['record']:
                continue

            data.append({
                        'month':MONTHS[day.month-1],
                        'year':day.year,
                        'day':day_of_year(day.month,day.day),
                        'date':day.isoformat(),
                        'record':records['record'],
                    })
        return data

class WeeklyRecord(JSONQueryView):
    accept_arg = True

    def make_query(self,ask=None):
        data = []
        today =  datetime.datetime.today()
        this_week = week_of_year(today.month,today.day)
        for week in range(this_week,0,-1):
            records = self.model.objects.filter(timestamp__week=week)
            records = filter_keys(ask,records)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))
            if not records['record']:
                pass
            else:
                data.append({
                    'week':week,
                    'year':today.year,
                    'month':MONTHS[today.month-1],
                    'record':records['record'],
                })
            today = today-datetime.timedelta(weeks=1)
        # raise Exception('break')
        return data

class MonthlyRecord(JSONQueryView):
    accept_arg = True

    def make_query(self,ask=None):
        data = []
        record = self.model.objects.all().dates('timestamp','month')
        if 'start' in ask.keys() and 'end' in ask.keys():
            start = ask['start']
            end = ask['end']
            record = record.filter(timestamp__range=(start,end))

        for month in sorted(list(record), reverse=True):
            records = self.model.objects.filter(timestamp__year=month.year,timestamp__month=month.month)
            records = filter_keys(ask,records,rangeless=True)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))

            if not records['record']:
                continue

            data.append({
                        'year':month.year,
                        'month':month.month,
                        'mname':MONTHS[month.month-1],
                        'record':records['record'],
                    })
        return data

class YearlyRecord(JSONQueryView):
    accept_arg = True

    def make_query(self,ask=None):
        data = []
        record = self.model.objects.all().dates('timestamp','year')
        if 'start' in ask.keys() and 'end' in ask.keys():
            start = ask['start']
            end = ask['end']
            record = record.filter(timestamp__range=(start,end))

        for year in sorted(list(record), reverse=True):
            records = self.model.objects.filter(timestamp__year=year.year)
            records = filter_keys(ask,records,rangeless=True)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))

            if not records['record']:
                continue

            data.append({
                        'year':year.year,
                        'record':records['record'],
                    })
        return data

class DailySaleRecord(DailyRecord):
    price = 'sp'
    quant = 'quantity'

class DailyPurchaseRecord(DailyRecord):
    price = 'cp'
    quant = 'quantity'

class WeeklySaleRecord(WeeklyRecord):
    price = 'sp'
    quant = 'quantity'

class WeeklyPurchaseRecord(WeeklyRecord):
    price = 'cp'
    quant = 'quantity'

class MonthlySaleRecord(MonthlyRecord):
    price = 'sp'
    quant = 'quantity'

class MonthlyPurchaseRecord(MonthlyRecord):
    price = 'cp'
    quant = 'quantity'

class YearlySaleRecord(YearlyRecord):
    price = 'sp'
    quant = 'quantity'

class YearlyPurchaseRecord(YearlyRecord):
    price = 'cp'
    quant = 'quantity'
