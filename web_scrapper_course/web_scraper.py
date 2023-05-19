from bs4 import BeautifulSoup
from urllib.request import Request, urlopen

from typing import List, NamedTuple

scraped_course_data = []

class Course(NamedTuple):
    subject: str
    number: int
    keyword: str
    ucProficiency: str
    semester: str

url = "https://www.purdue.edu/science/Current_Students/general_education_elective_list.php"

request = Request(
    url,
    headers={'User-Agent': 'Mozilla/5.0'}
)

page = urlopen(request)
page_content_bytes = page.read()
page_html = page_content_bytes.decode("utf-8")

# print(page_html)

soup = BeautifulSoup(page_html, "html.parser")

course_rows = soup.find_all("table", id="example")[0].find_all("tbody")[0].find_all("tr")

# print(course_rows)
for course in course_rows:
    course_data = course.find_all("td")
    subject = course_data[0].getText()
    number = course_data[1].getText()
    keyword = course_data[2].getText()
    ucProficiency = course_data[3].getText()
    semester = course_data[4].getText()
    # print(subject, number, keyword, ucProficiency, semester)
    typed_course = Course(
        subject=subject,
        number=int(number),
        keyword=keyword,
        ucProficiency=ucProficiency,
        semester=semester,
    )
    scraped_course_data.append(typed_course)
    print(typed_course)