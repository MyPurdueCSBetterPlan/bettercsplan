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

resp = requests.get("https://www.cs.purdue.edu/undergraduate/curriculum/track_cse_fall2019.html")
cse_soup = BeautifulSoup(resp.content, 'html5lib')

cse_dict = {
    "name": "cse",
    "required": [],
    "elective": [],
    "choose": 0,
}

# notes for cse
# At least four (4) of the seven (7) classes for this track must be CS classes
# Any course beyond the one required class from the list of Applications/Systems courses also counts as an elective

# cse requirements
required_table = cse_soup.find("table", {"summary": re.compile("Required")})
required_body = required_table.find("tbody")

select = False
pick_one = []
for row in required_body.find_all("tr"):

    # dealing w/ choosing one from a list
    if row.find("td") is not None and row.find("strong") is not None:
        print("ayo")
        select = True
        if len(pick_one) != 0:
            cse_dict['required'].append(pick_one)
        pick_one = []
    if select:
        for entry in row.find_all("a"):
            pick_one.append(entry.text)
            # see second note above
            cse_dict['elective'].append(entry.text)

    # dealing with an or condition
    else:
        or_cond = False
        if row.find("p", string='or'):
            or_cond = True
        if or_cond:
            or_array = []
            for entry in row.find_all("a"):
                or_array.append(entry.text)
            cse_dict['required'].append(or_array)
        else:
            for entry in row.find_all("a"):
                cse_dict['required'].append(entry.text)
if len(pick_one) != 0:
    cse_dict['required'].append(pick_one)

print(cse_dict['required'])

# cse electives
elective_table = cse_soup.find("table", {"summary": "Elective courses: option 1"})
caption = elective_table.find("caption").text
start_index = caption.index("(") + 1
end_index = caption.index(")")
cse_dict['choose'] = caption[start_index:end_index]
elective_body = elective_table.find("tbody")
for row in elective_body.find_all("tr"):
    for entry in row.find_all("a"):
        cse_dict['elective'].append(entry.text)

track_collection.insert_one(cse_dict)