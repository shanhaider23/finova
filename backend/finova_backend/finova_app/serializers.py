from rest_framework import serializers
from .models import MonthlyRecord

class MonthlyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyRecord
        fields = '__all__'