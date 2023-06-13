from django.core.management.base import BaseCommand

from cities.models import City
import json

class Command(BaseCommand):
    help = 'Setup cities'

    def add_arguments(self, parser):
        parser.add_argument('type', nargs='+', type=str)

    def handle(self, *args, **options):
        for type in options['type']:

            if type == 'insert':
                try:
                    if City.objects.count() > 0:
                        print("Cities already exist")
                        return

                    listJson = open('cities.json')
                    data = json.load(listJson)
                    for city in data:
                        print(city)
                        City(
                        id=city["city_id"],
                        region=city["region_id"],
                        name_ar=city["name_ar"],
                        name_en=city["name_en"],
                        latitude=city['center'][0],
                        longitude=city['center'][1]
                        ).save()

                    print("insert cities to database successfully") 

                except Exception as e:
                    print("Error setup cities: %s" % e)

            else:
                print("Error: type not found\nType: insert, delete")
        