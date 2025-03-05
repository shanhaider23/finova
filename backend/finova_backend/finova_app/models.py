from django.db import models

class Budget(models.Model):
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=50)
    icon = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Expense(models.Model):
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    category = models.CharField(max_length=255)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.name

class Monthly(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    category = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50)
    date = models.DateField()
    created_at = models.DateTimeField()
    created_by = models.CharField(max_length=255)

    def __str__(self):
        return self.title