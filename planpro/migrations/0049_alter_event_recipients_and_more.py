# Generated by Django 4.2.6 on 2024-01-12 18:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('planpro', '0048_event_archived_is_cancelled_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='recipients',
            field=models.ManyToManyField(related_name='received_events', through='planpro.Event_Recipient', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='event_archived',
            name='recipients',
            field=models.ManyToManyField(related_name='archived_received_events', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='friendship',
            name='recipient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_requests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='mail',
            name='recipients',
            field=models.ManyToManyField(related_name='received_emails', through='planpro.Mail_Recipient', to=settings.AUTH_USER_MODEL),
        ),
    ]
