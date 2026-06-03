import requests

url = "https://www.techcombank.com/ho-tro/cau-hoi-thuong-gap"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,vi;q=0.8"
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    print("Status:", response.status_code)
    print("Content-Type:", response.headers.get("Content-Type"))
    with open("techcombank_faq.html", "w", encoding="utf-8") as f:
        f.write(response.text[:50000])
    print("Saved first 50000 characters of page content to techcombank_faq.html")
except Exception as e:
    print("Error:", e)
