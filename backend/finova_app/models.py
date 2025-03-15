from django.db import models

class MonthlyRecord(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # 'income' or 'expense'
    category = models.CharField(max_length=100)
    amount = models.FloatField()
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.date} - {self.name} - {self.type} - {self.amount}"