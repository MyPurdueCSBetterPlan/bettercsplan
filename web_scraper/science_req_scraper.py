import sqlite3
import requests
import html5lib
from bs4 import BeautifulSoup

# sqlite database connection
db_con = sqlite3.connect("../server/classes.db")
cursor = db_con.cursor()

# for wc, just set equal to core wc

# tw and tp
twtp_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/approved"
                         "-courses-in-technical-writing.html")
twtp_soup = BeautifulSoup(twtp_resp.content, 'html5lib')

# team
team_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/approved"
                         "-courses-in-teambuilding-and-collaboration.html")
team_soup = BeautifulSoup(team_resp.content, 'html5lib')

# language and culture
# this is weird cuz there's different ways to meet the requirement w/ culture and JEDI courses
lang_cult_resp = requests.get(
    "https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/current"
    "-students-page1.html")
lang_cult_soup = BeautifulSoup(lang_cult_resp.content, 'html5lib')

# great issues
issues_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/Great"
                           "%20Issues%20Courses.php")
issues_soup = BeautifulSoup(issues_resp.content, 'html5lib')

# sts is same as core_sts except removing cs no count list
sts_no_count = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/cos"
                            "-no-count-computer-science.php")
no_sts_soup = BeautifulSoup(sts_no_count.content, 'html5lib')

# lab science
lab_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements/approved"
                        "-sequences-in-laboratory-science.html")
lab_soup = BeautifulSoup(lab_resp.content, 'html5lib')

# math
# i don't think this is even necessary cuz calc is required for cs

# stat
stat_resp = requests.get("https://www.purdue.edu/science/Current_Students/curriculum_and_degree_requirements"
                         "/laboratory-science.html")
stat_soup = BeautifulSoup(stat_resp.content, 'html5lib')

# computing
# I also don't think this is even necessary cuz cs180 meets this

# gen-ed
# copy and paste Hojin's code here but make it work with sqlite
