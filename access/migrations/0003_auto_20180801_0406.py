# Generated by Django 2.0.6 on 2018-08-01 04:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('access', '0002_auto_20180729_2356'),
    ]

    operations = [
        migrations.AlterField(
            model_name='access',
            name='branch',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='osm.BussinessBranch'),
        ),
        migrations.AlterField(
            model_name='access',
            name='bussiness',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='osm.Bussiness'),
        ),
    ]