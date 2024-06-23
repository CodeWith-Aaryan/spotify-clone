document.addEventListener('DOMContentLoaded', function() {
    const albumDiv = document.getElementById('album');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const seekBar = document.getElementById('seekBar');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeBar = document.getElementById('volumeBar');

    let isPlaying = false;
    let isVolumeMuted = false;

    // Function to play the song
    function playSong(songUrl) {
        audioPlayer.src = songUrl;
        audioPlayer.play();
        isPlaying = true;
        updatePlayPauseButton();
    }

    // Update play/pause button
    function updatePlayPauseButton() {
        if (isPlaying) {
            playPauseBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
        } else {
            playPauseBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
        }
    }

    // Update seek bar and time
    function updateSeekBar() {
        seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
        duration.textContent = formatTime(audioPlayer.duration);
    }

    // Format time in MM:SS format
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        if (secs < 10) {
            secs = '0' + secs;
        }
        return minutes + ':' + secs;
    }

    // Event listeners
    playPauseBtn.addEventListener('click', function() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    });

    audioPlayer.addEventListener('timeupdate', function() {
        updateSeekBar();
    });

    seekBar.addEventListener('input', function() {
        const seekTo = audioPlayer.duration * (seekBar.value / 100);
        audioPlayer.currentTime = seekTo;
    });

    volumeBtn.addEventListener('click', function() {
        if (isVolumeMuted) {
            audioPlayer.volume = volumeBar.value;
            isVolumeMuted = false;
            volumeBtn.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
        } else {
            audioPlayer.volume = 0;
            isVolumeMuted = true;
            volumeBtn.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
        }
    });

    volumeBar.addEventListener('input', function() {
        audioPlayer.volume = volumeBar.value;
        if (volumeBar.value == 0) {
            volumeBtn.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
        } else {
            volumeBtn.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
        }
        isVolumeMuted = false;
    });

    // Fetch data and populate albumDiv
    fetch('/get_songs')
        .then(response => response.json())
        .then(data => {
            data.songs.forEach(song => {
                const songplayer = song.song_file.split('/')[2]; // Adjust index based on your folder structure
                const songName = songplayer.split('.')[0];
                const coverPhoto = song.cover_photo;

                const songplayerDiv = document.createElement('div');
                songplayerDiv.classList.add('songplayers');

                const img = document.createElement('img');
                img.src = coverPhoto;
                img.alt = `${songplayer} - ${songName}`;
                songplayerDiv.appendChild(img);

                const h4 = document.createElement('h4');
                h4.textContent = songName;
                songplayerDiv.appendChild(h4);

                const playDiv = document.createElement('div');
                playDiv.classList.add('play');
                const playButton = document.createElement('span');
                playButton.classList.add('material-symbols-outlined', 'playbutton');
                playButton.textContent = 'play_arrow';
                playDiv.appendChild(playButton);
                songplayerDiv.appendChild(playDiv);

                // Add click listener to play the song
                songplayerDiv.addEventListener('click', function() {
                    playSong(song.song_file);
                });

                albumDiv.appendChild(songplayerDiv);
            });
        })
        .catch(error => console.error('Error fetching songs:', error));
});
