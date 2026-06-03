import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

url = "https://www.techcombank.com/ho-tro"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.find_all('a')
    faq_links = []
    for link in links:
        href = link.get('href')
        if href:
            full_url = urljoin(url, href)
            if "ho-tro" in full_url or "faq" in full_url or "cau-hoi" in full_url:
                faq_links.append(full_url)
                
    print(f"Found {len(faq_links)} links:")
    for l in set(faq_links):
        print(f"- {l}")
except Exception as e:
    print("Error:", e)
