from datetime import datetime

date = "2026-03-18T04:10:31"
published = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S')
print(published.date())
print(published.time())