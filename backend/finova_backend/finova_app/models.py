from django.db import models

class MonthlyIncome(models.Model):
    month = models.DateField()
    amount = models.FloatField()

    def __str__(self):
        return f"{self.month} - {self.amount}"


class MonthlyExpense(models.Model):
    date = models.DateField()
    amount = models.FloatField()
    category = models.CharField(max_length=100)  # Optional: for categorization
    description = models.TextField(blank=True, null=True)  # Optional

    def __str__(self):
        return f"{self.date} - {self.amount}"
