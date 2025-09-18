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
    
class ParentBudget(models.Model):
    name = models.CharField(max_length=255)
    amount = models.FloatField()
    currency = models.CharField(max_length=50)
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.amount} {self.currency}"

class Budget(models.Model):
    name = models.CharField(max_length=255)
    amount = models.CharField(max_length=255)
    currency = models.CharField(max_length=50)
    icon = models.CharField(max_length=255, null=True, blank=True)
    created_by = models.CharField(max_length=255)
    parent=models.ForeignKey(ParentBudget, on_delete=models.CASCADE, related_name="child_budgets", null=True, blank=True)

    def __str__(self):
        parent_name = self.parent.name if self.parent else "No Parent"
        return f"{self.name} ({parent_name}) - {self.amount} {self.currency}"


class Expense(models.Model):
    name = models.CharField(max_length=255)
    amount = models.FloatField(default=0)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField()
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.amount}"


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50)
    date = models.DateField()
    created_at = models.DateTimeField()
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} - {self.status}"