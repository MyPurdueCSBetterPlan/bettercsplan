import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 5)
driver.get("https://catalog.purdue.edu/content.php?catoid=15&navoid=19001")

for page in range(2, 81):
    class_links = driver.find_elements(By.CSS_SELECTOR, 'td.width > a')
    # click each class to show description and credit hours
    for link in class_links:
        link.click()
        time.sleep(0.2)
    print("clicked next page")
    next_page = driver.find_element(By.CSS_SELECTOR, 'a[aria-label="Page {}"]'.format(page))
    next_page.click()






