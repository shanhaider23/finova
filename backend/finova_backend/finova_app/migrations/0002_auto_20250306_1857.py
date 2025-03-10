# Generated by Django 3.2 on 2025-03-06 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finova_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MonthlyIncome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month', models.DateField()),
                ('amount', models.FloatField()),
            ],
        ),
        migrations.RemoveField(
            model_name='expense',
            name='budget',
        ),
        migrations.DeleteModel(
            name='Monthly',
        ),
        migrations.DeleteModel(
            name='Task',
        ),
        migrations.DeleteModel(
            name='Budget',
        ),
        migrations.DeleteModel(
            name='Expense',
        ),
    ]
