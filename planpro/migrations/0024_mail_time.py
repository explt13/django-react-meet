# Generated by Django 4.2.6 on 2024-01-06 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('planpro', '0023_alter_event_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='mail',
            name='time',
            field=models.DateTimeField(default=None),
            preserve_default=False,
        ),
    ]
