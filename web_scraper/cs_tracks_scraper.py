# https://www.cs.purdue.edu/undergraduate/curriculum/bachelor.html
# probably should use selenium here cuz we have to click a bunch of links

import time
import sqlite3

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

# sqlite database connection
db_con = sqlite3.connect("../server/classes.db")
cursor = db_con.cursor()

# open webpage with selenium
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 5)
driver.get("https://www.cs.purdue.edu/undergraduate/curriculum/bachelor.html")

core_table = driver.find_element(By.CSS_SELECTOR, "table[summary='Core requirements'] > tbody")
core_links = core_table.find_elements(By.CSS_SELECTOR, 'a')

original_tab = driver.current_window_handle

for link in core_links:
    link.click()

    # switch to new tab
    for tab in driver.window_handles:
        if tab != original_tab:
            driver.switch_to.window(tab)
            time.sleep(2)

            # parse html here

            driver.close()
            driver.switch_to.window(original_tab)








