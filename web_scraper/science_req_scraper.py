import sqlite3
import requests
import html5lib
from bs4 import BeautifulSoup

# sqlite database connection
db_con = sqlite3.connect("../server/classes.db")
cursor = db_con.cursor()

# for wc, just set equal to core wc

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
    if (class_id.__contains__('(')):
        class_id = row[0:row.find(' (')]
    print(class_id)
    # cursor.execute("""
    #             UPDATE classesList SET ? = true WHERE class_id = ?
    #         """, ["tw", class_id])


# Approved courses in Technical Presentation:
# Any course that meets the University Core Oral Communication (OC) requirement will also fulfill this requirement.
# can we just refer to the core_oc instead of using this column? or I should create one..?

for i in range(index_save + 1, len(filtered_course)):
    row = filtered_course[i].getText()
    if row.__contains__("course that meets"):
        index_save = i
        break
    class_id = row[0:row.find(':')]
    if (class_id.__contains__('(')):
        class_id = row[0:row.find(' (')]
    print(class_id)
    # cursor.execute("""
    #                 UPDATE classesList SET ? = true WHERE class_id = ?
    #             """, ["tp", class_id])
    # cursor.execute("""
    #                     UPDATE classesList SET ? = true WHERE class_id = ?
    #                 """, ["tw", class_id])



# team
# met by cs180

# language and culture
# for the language courses, make an array of language course prefixes,
# go through _01 and _02 in a for loop until you can't find any more

lang_prefix = ["ARAB", "ASL", "CHNS", "FR", "GER", "GREK", "HEBR", "ITAL", "JPNS", "KOR", "LATN", "LC", "PTGS", "RUSS", "SPAN"]

for lang in lang_prefix:
    for i in range(1, 5):
        for j in range(1,3):
            number = str(i) + "0" + str(j) + "00"
            class_id = lang + " " + number
            # print(class_id)
            # cursor.execute("""UPDATE classesList SET ? = true false WHERE class_id = ?""", ["sci_lang", class_id])
    if lang == "HEBR":
        for i in range(1, 3):
            for j in range(1,3):
                number = str(i) + "2" + str(j) + "00"
                class_id = lang + " " + number
                # print(class_id)
                # cursor.execute("""UPDATE classesList SET ? = true false WHERE class_id = ?""", ["sci_lang", class_id])

# scrape for JEDI (culture) courses
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
    # print(class_id)

    #cursor.execute("""
    #        UPDATE classesList SET ? = false true WHERE class_id = ?
    #    """, ["sci_lang", class_id])

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

    #cursor.execute("""
            #UPDATE classesList SET ? = true WHERE class_id = ?
        #""", ["sci_gis", class_id])

# sts is same as core_sts except removing cs no count list
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

    #cursor.execute("""
            #UPDATE classesList SET ? = false WHERE class_id = ?
        #""", ["sci_sts", class_id])

# lab science
lab_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/approved"
                        "-sequences-in-laboratory-science.html")
lab_soup = BeautifulSoup(lab_resp.content, 'html5lib')

# math
# i don't think this is even necessary cuz calc is required for cs

# stat
# this is literally just stat 350/511
# cursor.execute("""UPDATE classesList SET ? = true WHERE class_id = ?""", ["sci_stat", "STAT 35000"])
# cursor.execute("""UPDATE classesList SET ? = true WHERE class_id = ?""", ["sci_stat", "STAT 51100"])

# computing
# I also don't think this is even necessary cuz cs180 meets this

# gen-ed
# copy and paste Hojin's code here but make it work with sqlite
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

    #cursor.execute("""
            #UPDATE classesList SET ? = true WHERE class_id = ?
        #""", ["sci_gen", class_id])

