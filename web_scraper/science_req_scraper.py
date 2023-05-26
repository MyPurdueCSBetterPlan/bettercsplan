import sqlite3
import requests
import html5lib
from bs4 import BeautifulSoup

# this site is for algorithmic foundations track but has all info for cs degree requirements
# https://catalog.purdue.edu/preview_program.php?catoid=15&poid=24886&returnto=20712

# sqlite database connection
db_con = sqlite3.connect("../server/classes.db")
cursor = db_con.cursor()

# wc/freshman composition is same as core oc so no need to include

# tw and tp
# for tp, change core-oc to also fullfill tp
twtp_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/approved"
                         "-courses-in-technical-writing.html")
twtp_soup = BeautifulSoup(twtp_resp.content, 'html5lib')

container = twtp_soup.find('div', class_='maincontent col-lg-9 col-md-9 col-sm-9 col-xs-12 right')
course_entries = container.find_all("p")
filtered_course = [entry for entry in course_entries if "style13" not in entry.get('class', [])]
index_save = 0

for i in range(1, len(filtered_course)):
    # print(filtered_course[i].getText())
    row = filtered_course[i].getText()
    if row.__contains__("course that meets"):
        index_save = i
        break
    class_id = row[0:row.find(':')]
    if class_id.__contains__('('):
        class_id = row[0:row.find(' (')]

    # updates table with courses that only meet technical writing
    cursor.execute("""
             UPDATE classesList SET sci_tw = true WHERE class_id = ?
             """, [class_id])
    db_con.commit()

# updates table with courses that only meet technical presentation (same as university core oral communication)
cursor.execute("""
            UPDATE classesList SET sci_tp = core_oc
            """)
db_con.commit()

for i in range(index_save + 1, len(filtered_course)):
    row = filtered_course[i].getText()
    if row.__contains__("course that meets"):
        index_save = i
        break
    class_id = row[0:row.find(':')]
    if class_id.__contains__('('):
        class_id = row[0:row.find(' (')]

    # updates table with courses that meet both technical writing and technical presentation
    cursor.execute("""
                UPDATE classesList SET "sci_tp" = "T" WHERE class_id = ?
                """, [class_id])
    cursor.execute("""
               UPDATE classesList SET "sci_tw" = "T" WHERE class_id = ?
               """, [class_id])
    db_con.commit()

# team met by cs180: no need to include

# language and culture
# for the language courses, make an array of language course prefixes,
# go through _01 and _02 in a for loop until you can't find any more

lang_prefix = ["ARAB", "ASL", "CHNS", "FR", "GER", "GREK", "HEBR", "ITAL", "JPNS", "KOR", "LATN", "LC", "PTGS", "RUSS",
               "SPAN"]

for lang in lang_prefix:
    for i in range(1, 5):
        for j in range(1, 3):
            number = str(i) + "0" + str(j) + "00"
            class_id = lang + " " + number
            # print(class_id)
            cursor.execute("""UPDATE classesList SET "sci_lang" = "T F" WHERE class_id = ?""", [class_id])
            db_con.commit()
    if lang == "HEBR":
        for i in range(1, 3):
            for j in range(1, 3):
                number = str(i) + "2" + str(j) + "00"
                class_id = lang + " " + number
                # print(class_id)
                cursor.execute("""UPDATE classesList SET "sci_lang" = "T F" WHERE class_id = ?""", [class_id])
                db_con.commit()


# scrape for culture courses
lang_cult_resp = requests.get("https://www.purdue.edu/science/Current_Students/"
                              "all_current_approved_courses.php?_ga=2.23317946.1023436512.1676294680-1084721351.1670596101")
lang_cult_soup = BeautifulSoup(lang_cult_resp.content, 'html5lib')

lang_cult_rows = lang_cult_soup.find_all("table", id="example")[0].find_all("tbody")[0].find_all("tr")

for course in lang_cult_rows:
    data = course.find_all("td")

    # get subject name and split at "-"
    subject = data[0].getText()
    prefix = subject.split(" -")[0]

    # get course number
    number = data[1].getText()

    class_id = prefix + " " + number
    cursor.execute("""
                UPDATE classesList SET "sci_lang" = "F T" WHERE class_id = ?
                """, [class_id])
    db_con.commit()

# great issues
issues_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/Great"
                           "%20Issues%20Courses.php")
issues_soup = BeautifulSoup(issues_resp.content, 'html5lib')

issues_rows = issues_soup.find_all("table", id="example")[0].find_all("tbody")[0].find_all("tr")

for course in issues_rows:
    data = course.find_all("td")

    # get subject name and split at "-"
    subject = data[0].getText()
    prefix = subject.split(" -")[0]

    # get course number
    number = data[1].getText()

    class_id = prefix + " " + number
    # print(class_id)

    cursor.execute("""
            UPDATE classesList SET "sci_gis" = "T" WHERE class_id = ?
            """, [class_id])
    db_con.commit()

# sts (multidisciplinary) is same as core_sts except removing cs no count list
# (honestly put all the core_sts courses and sts and then go through no count list and set them back to NULL)

sts_no_count = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/cos"
                            "-no-count-computer-science.php")
no_sts_soup = BeautifulSoup(sts_no_count.content, 'html5lib')

no_sts_rows = no_sts_soup.find_all("table")[0].find_all("tbody")[0].find_all("tr")

no_sts_rows.pop(0)

for course in no_sts_rows:
    data = course.find_all("td")

    # get subject name and split at "-"
    prefix = data[0].getText()

    # get course number
    raw_number = data[1].getText()
    number = raw_number.split(" ")[0]

    class_id = prefix + " " + number
    # print(class_id)

    cursor.execute("""
                UPDATE classesList SET "sci_sts" = "core_sts"
                """)
    cursor.execute("""
                UPDATE classesList SET "sci_sts" = "F" WHERE class_id = ?
                """, [class_id])
    db_con.commit()

# lab science
lab_resp = requests.get("https://catalog.purdue.edu/preview_program.php?catoid=8&poid=9739")
lab_soup = BeautifulSoup(lab_resp.content, 'html5lib')

course_rows = lab_soup.find_all('div', class_='acalog-core')[0].find('ul').find_all('a')

for i in range(len(course_rows)):
    row_entry = course_rows[i].getText()
    class_id = row_entry[:row_entry.index(' ', 5)]
    cursor.execute("""
            UPDATE classesList SET "sci_lab" = "T" WHERE class_id = ?
            """, [class_id])
    db_con.commit()

# math
cursor.execute("""
            UPDATE classesList SET "sci_math" = "T" WHERE class_id = "MA 16100"
            """)
cursor.execute("""
            UPDATE classesList SET "sci_math" = "T" WHERE class_id = "MA 16500"
            """)
cursor.execute("""
            UPDATE classesList SET "sci_math" = "T" WHERE class_id = "MA 16200"
            """)
cursor.execute("""
            UPDATE classesList SET "sci_math" = "T" WHERE class_id = "MA 16600"
            """)
db_con.commit()

# stat
# this is literally just stat 350/511
cursor.execute("""UPDATE classesList SET "sci_stat" = "T" WHERE class_id = ?""", ["STAT 35000"])
cursor.execute("""UPDATE classesList SET "sci_stat" = "T" WHERE class_id = ?""", ["STAT 51100"])
db_con.commit()

# computing - met by cs180

# gen-ed
gen_resp = requests.get("https://www.purdue.edu/science/Current_Students/general_education_elective_list.php")
gen_soup = BeautifulSoup(gen_resp.content, 'html5lib')

gen_rows = gen_soup.find_all("table", id="example")[0].find_all("tbody")[0].find_all("tr")

for course in gen_rows:
    data = course.find_all("td")

    # get subject name and split at "-"
    subject = data[0].getText()
    prefix = subject.split(" -")[0]

    # get course number
    number = data[1].getText()

    class_id = prefix + " " + number
    print(class_id)

    cursor.execute("""
                UPDATE classesList SET "sci_gen" = "T" WHERE class_id = ?
                """, [class_id])
    db_con.commit()
