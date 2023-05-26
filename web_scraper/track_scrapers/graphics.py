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

resp = requests.get("https://www.cs.purdue.edu/undergraduate/curriculum/track_cgv_fall2019.html")
graphics_soup = BeautifulSoup(resp.content, 'html5lib')

graphics_dict = {
    "name": "graphics",
    "required": [],
    "elective": [],
    "choose": 0,
}

# notes for graphics
# Electives could include 1 semester of CS 49000 project course with Computer Graphics Visualization LAB (CGVLAB)
# No course can be counted for both required and elective credit. This is true for all tracks.

# cse requirements
required_table = graphics_soup.find("table", {"summary": re.compile("Required")})
required_body = required_table.find("tbody")

select = False
pick_one = []
for row in required_body.find_all("tr"):

    # dealing w/ choosing one from a list
    if row.find("td") is not None and row.find("strong") is not None:
        select = True
        if len(pick_one) != 0:
            graphics_dict['required'].append(pick_one)
        pick_one = []
    if select:
        for entry in row.find_all("a"):
            pick_one.append(entry.text)
    else:
        or_cond = False
        if row.find("p", string='or'):
            or_cond = True

        # dealing with an or condition
        if or_cond:
            or_array = []
            for entry in row.find_all("a"):
                or_array.append(entry.text)
            graphics_dict['required'].append(or_array)

        # normal entry
        elif len(row.find_all("a")) != 0:
            class_name = ""
            for entry in row.find_all("a"):
                class_name += entry.text.strip()
            print(class_name)
            graphics_dict['required'].append(class_name)
            print(graphics_dict['required'])
        else:
            for entry in row.find_all("a"):
                graphics_dict['required'].append(entry.text)

if len(pick_one) != 0:
    graphics_dict['required'].append(pick_one)

# graphics electives
elective_table = graphics_soup.find("table", {"summary": re.compile("Elective")})
caption = elective_table.find("caption").text
start_index = caption.index("(") + 1
end_index = caption.index(")")
graphics_dict['choose'] = caption[start_index:end_index]
elective_body = elective_table.find("tbody")
for row in elective_body.find_all("tr"):
    for entry in row.find_all("a"):
        graphics_dict['elective'].append(entry.text)

print(graphics_dict)
track_collection.insert_one(graphics_dict)