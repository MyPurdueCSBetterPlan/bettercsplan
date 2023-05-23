import time
import sqlite3

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


# checks if a string is a float
def isfloat(string):
    try:
        float(string)
        return True
    except:
        return False


# sqlite database connection
db_con = sqlite3.connect("../server/classes.db")
cursor = db_con.cursor()
cursor.execute("""
            CREATE TABLE classesList(class_id, full_name, description, credit_hours, semesters_offered, prereqs, 
            core_wc, core_il, core_oc, core_sci, core_sts, core_mqr, core_hum, core_bss, sci_wc, sci_tw, sci_tp,
            sci_team, sci_lang, sci_lab, sci_math, sci_stat, sci_comp, sci_gis, sci_gen)
            """)

# open webpage with selenium
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 5)
driver.get("https://catalog.purdue.edu/content.php?catoid=15&navoid=19001")

# iterates through every page


for page in range(1, 82):

    if page != 1:
        print("clicked next page")
        next_page = driver.find_element(By.CSS_SELECTOR, 'a[aria-label="Page {}"]'.format(page))
        next_page.click()

    # clicks each class to show description and credit hours
    class_links = driver.find_elements(By.CSS_SELECTOR, 'td.width > a')
    for link in class_links:
        link.click()
        time.sleep(0.3)

    # parses text for each class
    classes = driver.find_elements(By.CSS_SELECTOR, 'td.coursepadding > div:nth-of-type(2)')
    for cls in classes:

        # id + full_name
        cls_title = cls.text.split("\n", 1)[0]
        cls_id = cls_title.split("-")[0].strip()
        cls_full_name = cls_title.split("-")[1].strip()

        # no description/credits available
        if len(cls.text.split("\n")) == 1:
            cursor.execute("""
                        INSERT INTO classesList (class_id, full_name) 
                        VALUES (?, ?)
                        """, [cls_id, cls_full_name])
            db_con.commit()

        # description + credits
        else:
            cls_info = cls.text.split("\n", 1)[1]
            if "Credits: " not in cls_info:
                continue
            cls_hours = cls_info.split("Credits:")[1].strip()
            if not isfloat(cls_hours):
                continue

            # includes empty string or description based on if description is available
            cls_desc = cls_info.split("Credits:")[0]

            # getting the semester from the class description
            cls_sem = ""
            if "Fall" in cls_desc:
                cls_sem += "Fall "
            if "Spring" in cls_desc:
                cls_sem += "Spring "
            if "Summer" in cls_desc:
                cls_sem += "Summer "
            print(cls_id)
            cursor.execute("""
                        INSERT INTO classesList (class_id, full_name, description, credit_hours, semesters_offered) 
                        VALUES (?, ?, ?, ?, ?)
                        """, [cls_id, cls_full_name, cls_desc, cls_hours, cls_sem])
            db_con.commit()



