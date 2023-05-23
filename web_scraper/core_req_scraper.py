import sqlite3
import requests
import html5lib
from bs4 import BeautifulSoup

# sqlite database connection
db_con = sqlite3.connect("../server/classes.db")
cursor = db_con.cursor()

resp = requests.get("https://www.purdue.edu/provost/students/s-initiatives/curriculum/courses.html")

soup = BeautifulSoup(resp.content, 'html5lib')

core_req = ["core_bss", "core_hum", "core_il", "core_oc", "core_mqr", "core_sci", "core_sts", "core_wc"]

panels = soup.find_all("div", class_="panel")

# removes the first "panel" which is just white space
panels.pop(0)

for index, panel in enumerate(panels):

    # skip matches where there are more css classes than just "panel"
    if len(panel["class"]) != 1:
        continue
    for req in panel.children:
        words = req.text.split(" ")

        # skips children that are not actual purdue classes
        if len(words) < 2:
            continue

        # removes non-alphabetic characters from prefix
        prefix = ''.join([i for i in words[0] if i.isalpha()])

        # removes non-numeric characters from number
        number = ''.join([i for i in words[1] if i.isnumeric()])

        class_id = prefix + " " + number

        # updates the table
        cursor.execute(f"""
            UPDATE classesList SET {core_req[index]} = "T" WHERE class_id = ?
        """, [class_id])
        db_con.commit()






