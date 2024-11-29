import requests, os
from urllib.parse import urlencode
from dotenv import load_dotenv
from colorama import Fore, Style

try:
    load_dotenv()
    YOUTUBE_API_KEY = os.getenv("YOUTUBE")
except Exception as e:
    print(f"{Fore.RED}Youtube Connection Error: {e} \n{Style.RESET_ALL}")

YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"


def fetch_educational_videos(prompt, max_results=5):
    query = urlencode(
        {
            "q": prompt + " (in python)",
            "part": "snippet",
            "type": "video",
            "maxResults": max_results,
            "key": YOUTUBE_API_KEY,
        }
    )
    url = f"{YOUTUBE_API_URL}?{query}"

    response = requests.get(url)
    if response.status_code == 200:
        videos = response.json().get("items", [])
        video_links = [
            {
                "title": video["snippet"]["title"],
                "link": f"https://www.youtube.com/watch?v={video['id']['videoId']}",
                "description": video["snippet"]["description"],
                "publishedAt": video["snippet"]["publishedAt"],
            }
            for video in videos
        ]
        return video_links
    else:
        return {"error": "Failed to fetch videos"}
