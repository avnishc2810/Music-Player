from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pytube import Search
import yt_dlp
from pathlib import Path
import glob

app = Flask(__name__)
CORS(app)  # Allow requests from React or Node

def scrape_vid_id(query):
    search = Search(query)
    if search.results:
        video = search.results[0]
        return video.video_id
    return None

def download_vids_from_ids(ids, artist, title):
    SAVE_PATH = Path(r"D:\\College Projects\\Spotify-Clone\\frontend\\public\\songs")

    ydl_opts = {
        'format': 'bestaudio/best',
        'ffmpeg_location': r'D:\ffmpeg',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': str(SAVE_PATH / '%(title)s.%(ext)s'),
        'nocheckcertificate': True,
        'quiet': True,
        'no_warnings': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for vid_id in ids:
            try:
                url = f"https://www.youtube.com/watch?v={vid_id}"
                ydl.download([url])
            except Exception as e:
                return f"Error downloading {vid_id}: {e}"

    # After download, rename file to artist-title.mp3
    # The downloaded file is inside SAVE_PATH, but we don't know exact title
    # So we search for the newest .mp3 file and rename it
    mp3_files = sorted(SAVE_PATH.glob('*.mp3'), key=os.path.getmtime, reverse=True)
    if mp3_files:
        latest_file = mp3_files[0]
        new_name = f"{artist}-{title}.mp3"
        new_file_path = SAVE_PATH / new_name
        # Rename only if new_file_path doesn't exist or overwrite
        if new_file_path.exists():
            new_file_path.unlink()  # Remove existing to avoid conflict
        latest_file.rename(new_file_path)
        return f"Download complete: {new_name}"
    else:
        return "Download complete but no mp3 found to rename"

@app.route('/download', methods=['POST'])
def download_handler():
    data = request.json
    title = data.get('title')
    artist = data.get('artist')

    if not title or not artist:
        return jsonify({'error': 'Missing title or artist'}), 400

    query = f"{artist} {title} lyrics"  # Use both artist and title for search
    try:
        vid_id = scrape_vid_id(query)
        if not vid_id:
            return jsonify({'error': 'Video not found'}), 404
        message = download_vids_from_ids([vid_id], artist, title)
        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000)
