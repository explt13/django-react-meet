# Generated by Django 4.2.6 on 2024-01-11 12:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('planpro', '0036_rename_is_accepted_event_recipient_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event_recipient',
            name='recipient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]
