from django.contrib import admin
from .models import ParentBudget, Budget, Expense, MonthlyRecord, Task

admin.site.register(ParentBudget)
admin.site.register(Budget)
admin.site.register(Expense)
admin.site.register(MonthlyRecord)
admin.site.register(Task)