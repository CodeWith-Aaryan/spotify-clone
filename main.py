import os
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_songs')
def get_songs():
    songs = []
    songs_folder = 'static/songs'
    
    for root, dirs, files in os.walk(songs_folder):
        for song_folder in dirs:
            song_path = os.path.join(root, song_folder)
            mp3_file = None
            cover_photo = None
            
            for file in os.listdir(song_path):
                if file.endswith('.mp3'):
                    mp3_file = file
                elif file.endswith('.jpg') or file.endswith('.png'):
                    cover_photo = file
            
            if mp3_file and cover_photo:
                songs.append({
                    'song_file': f"{song_path}/{mp3_file}",
                    'cover_photo': f"{song_path}/{cover_photo}"
                })
    
    return jsonify(songs=songs)

if __name__ == '__main__':
    app.run(debug=True, host="192.168.0.137")
