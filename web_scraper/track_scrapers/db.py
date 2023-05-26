import re

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import requests
import html5lib
from bs4 import BeautifulSoup

# connecting to mongodb
uri = "mongodb+srv://bettercsplan:bettercsplan@cluster0.wsc5yxf.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.test
track_collection = db.tracks

resp = requests.get("https://www.cs.purdue.edu/undergraduate/curriculum/track_database_fall2019.html")
db_soup = BeautifulSoup(resp.content, 'html5lib')

db_dict = {
    "name": "db",
    "required": [],
    "elective": [],
    "choose": 0,
}

# notes for graphics
# Note: Senior Project must be at least 3 credits and approved by the track chair.
# (Examples: EPICS 41100/41200 Senior Design, CS 49000, CS 49700 Honors Research Project)
# No course can be counted for both required and elective credit. This is true for all tracks.

# db requirements (includes elective table because electives are not really electives)
required_table = db_soup.find("table", {"summary": re.compile("Required")})
required_body = required_table.find("tbody")

select = False
pick_one = []
for row in required_body.find_all("tr"):
    # dealing w/ choosing one from a list
    if row.find("td") is not None and row.find("strong") is not None:
        select = True
        if len(pick_one) != 0:
            db_dict['required'].append(pick_one)
        pick_one = []
    if select:
        for entry in row.find_all("a"):
            pick_one.append(entry.text)
    else:
        or_cond = False
        if row.find("p", string='or') is not None or row.find('br') is not None:
            or_cond = True

        # dealing with an or condition
        if or_cond:
            or_array = []
            for entry in row.find_all("a"):
                or_array.append(entry.text)
            db_dict['required'].append(or_array)

        # normal entry
        elif len(row.find_all("a")) != 0:
            class_name = ""
            for entry in row.find_all("a"):
                class_name += entry.text.strip()
            print(class_name)
            db_dict['required'].append(class_name)
        else:
            for entry in row.find_all("a"):
                db_dict['required'].append(entry.text)

if len(pick_one) != 0:
    db_dict['required'].append(pick_one)

# adding to required because electives are not really electives
elective_table = db_soup.find("table", {"summary": re.compile("lective")})
db_dict['choose'] = 0
elective_body = elective_table.find("tbody")

select = False
pick_one = []
for row in elective_body.find_all("tr"):

    # dealing w/ choosing one from a list
    if row.find("td") is not None and row.find("strong") is not None:
        select = True
        if len(pick_one) != 0:
            db_dict['required'].append(pick_one)
        pick_one = []
    if select:
        for entry in row.find_all("a"):
            pick_one.append(entry.text)
    else:
        or_cond = False
        if row.find("p", string='or') is not None or row.find('br') is not None:
            or_cond = True

        # dealing with an or condition
        if or_cond:
            or_array = []
            for entry in row.find_all("a"):
                or_array.append(entry.text)
            db_dict['required'].append(or_array)

        # normal entry
        elif len(row.find_all("a")) != 0:
            class_name = ""
            for entry in row.find_all("a"):
                class_name += entry.text.strip()
            print(class_name)
            db_dict['required'].append(class_name)
        else:
            for entry in row.find_all("a"):
                db_dict['required'].append(entry.text)

if len(pick_one) != 0:
    db_dict['required'].append(pick_one)

print(db_dict)
# track_collection.insert_one(graphics_dict)