from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pytube import Search
import yt_dlp
from pathlib import Path

app = Flask(__name__)
CORS(app)

def scrape_vid_id(query):
    print("Searching for:", query)
    search = Search(query)
    if search.results:
        return search.results[0].video_id
    return None

def download_vids_from_ids(ids, artist, title):
    SAVE_PATH = str(os.path.join(Path.home(), r"D:\\College Projects\\Spotify-Clone\\frontend\\public\\songs"))
    os.makedirs(SAVE_PATH, exist_ok=True)

    filename = f"{artist.strip()} - {title.strip()}".replace("/", "_")

    ydl_opts = {
        'format': 'bestaudio/best',
        'ffmpeg_location': r'D:\ffmpeg',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': f"{SAVE_PATH}/{filename}.%(ext)s",  # Rename output file
        'nocheckcertificate': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for vid_id in ids:
            try:
                url = f"https://www.youtube.com/watch?v={vid_id}"
                ydl.download([url])
            except Exception as e:
                return f"Error downloading video ID {vid_id}: {e}"
    return "Download complete"

@app.route('/download', methods=['POST'])
def download_handler():
    data = request.json
    title = data.get('title')
    artist = data.get('artist')

    if not title or not artist:
        return jsonify({'error': 'Missing title or artist'}), 400

    query = f"{artist} {title} lyrics"
    vid_id = scrape_vid_id(query)

    if not vid_id:
        return jsonify({'error': 'Video not found'}), 404

    result = download_vids_from_ids([vid_id], artist, title)
    return jsonify({'message': result})

if __name__ == '__main__':
    app.run(port=8000)