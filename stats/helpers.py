import math

MONTH_DAYS = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30,     10:31, 11:30, 12:31}

def day_of_year(month, month_day):
    """ This function returns the day of the year given the
    day of the month, so that 28th day of Febuary would be
    59th day of the year."""
    if month > 12 or month < 1:
        msg = "Month {} out of range, must lie within [1 12]".format(month)
        raise Exception(msg)

    if month_day > 31 or month_day < 1:
        msg = "Day of Month {} out of range, must lie within [1 12]".format(month_day)
        raise Exception(msg)

    year_day = 0
    for days in MONTH_DAYS.items():
        if month == days[0]:
            year_day += month_day
            break
        else:
            year_day += days[1]

    return year_day

def week_of_year(month, month_day):
    """ This function returns the week of the year given the
    day of the month, so that 28th day of Febuary would be in
    9th week of the year."""
    week_year = math.ceil(day_of_year(month, month_day)/7)
    return week_year

def filter_keys(ask,queryset,rangeless=False):
    """This function given a dictionary (ask) containing query keys and values and a queryset object would filter the queryset object based on the available keys in the ask dict"""
    if not ask:
        pass
    else:
        keys = ask.keys()
        if 'user' in keys:
            user = ask['user']
            queryset = queryset.filter(employee=user)
        if not rangeless and 'start' in keys and 'end' in keys: # Hahaa
            start = ask['start']
            end = ask['end']
            queryset = queryset.filter(timestamp__range=(start,end))
        if 'cash' in keys:
            cash = ask['cash']
            queryset = queryset.filter(cash=cash)
        if 'product' in keys:
            product = ask['product']
            queryset = queryset.filter(product=product)
    return queryset

if __name__ == '__main__':
    month = 2
    day = 28
    print(day_of_year(month,day))
    print(week_of_year(month,day))
