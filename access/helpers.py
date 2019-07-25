def date_time_split(date_time):
    if date_time:
        day = str(date_time.date())
        time = str(date_time.time()).split('.')[0]
    else:
        day = ""
        time = "Never"
    return (day,time)
