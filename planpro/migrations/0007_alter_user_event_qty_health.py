# Generated by Django 4.2.6 on 2023-12-23 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('planpro', '0006_rename_bar_user_event_qty_bar_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_event_qty',
            name='HEALTH',
            field=models.IntegerField(default=0, verbose_name='Health'),
        ),
    ]
