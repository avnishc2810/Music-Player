from flask import Flask,request,session,redirect,url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import time
import pandas as pd

app = Flask(__name__)
app.secret_key = "123456789"
app.config['SESSION_COOKIE_NAME'] = 'Cookie'
TOKEN_INFO = "token_info"

@app.route('/')
def login():    
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/redirect')
def redirect_to_page():
    sp_oauth = create_spotify_oauth()
    session.clear()
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session[TOKEN_INFO] = token_info

    return redirect(url_for('getTracks',_external = True))
@app.route('/getTracks')
def getTracks():
    try:
        token_info = get_token()
    except:
        print("User is not logged in")
        return redirect("/")
    
    sp = spotipy.Spotify(auth=token_info['access_token'])
    all_songs = []
    iter = 0

    while True:
        items = sp.current_user_saved_tracks(limit=50, offset=iter * 50)['items']
        iter += 1
        for item in items:
            track = item['track']
            song_name = track['name']
            artist_name = track['artists'][0]['name']
            val = song_name + '-' + artist_name
            all_songs += [val]
        if len(items) < 50:
            break

    # Save the songs to a CSV file
    df = pd.DataFrame(all_songs,columns=["Songs Name"])
    df.to_csv('songs.csv', index=False)

    return "Songs have been saved to songs.csv"

def get_token():
    token_info = session.get(TOKEN_INFO,None)
    if not token_info:
        raise "exception"

    now = int(time.time())
    is_expired = token_info['expires_at'] - now < 60

    if (is_expired):
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])

    
    return token_info


def create_spotify_oauth():
    return SpotifyOAuth(
        client_id="de20a484448c484a8b1940f2d7b7feba",
        client_secret="a672fa4eca924912bcbce43e634840ed",
        redirect_uri= url_for('redirect_to_page', _external = True),
        scope= "user-library-read"
    )