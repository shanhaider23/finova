# Generated by Django 3.2 on 2025-03-08 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finova_app', '0003_monthlyexpense'),
    ]

    operations = [
        migrations.CreateModel(
            name='MonthlyRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('name', models.CharField(max_length=255)),
                ('type', models.CharField(max_length=50)),
                ('category', models.CharField(max_length=100)),
                ('amount', models.FloatField()),
                ('created_by', models.CharField(max_length=255)),
            ],
        ),
        migrations.DeleteModel(
            name='MonthlyExpense',
        ),
        migrations.DeleteModel(
            name='MonthlyIncome',
        ),
    ]
