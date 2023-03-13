const   albumCovers = document.querySelectorAll(".box img"),
        theAudioEl = document.querySelector('audio'),
        playButton = document.querySelector('#playButton'),
        pauseButton = document.querySelector('#pauseButton'),
        rewindButton = document.querySelector('#rewindButton'),
        volSlider = document.querySelector('#volumeControl');


function loadAudio() {
    let currentSrc = `audio/${this.dataset.trackref}.mp3`;

    theAudioEl.src = currentSrc;    

    theAudioEl.load();


    playAudio();
}

function playAudio() { 
    theAudioEl.play(); 
}
function restartAudio() { 
    theAudioEl.currentTime = 0; 
    playAudio(); 
}

function pauseAudio() { theAudioEl.pause(); }

function setVolume() {
    
    console.log(this.value);

    
    theAudioEl.volume = (this.value/100); 
}


albumCovers.forEach(cover => cover.addEventListener('click', loadAudio));

playButton.addEventListener('click', playAudio);
rewindButton.addEventListener('click', restartAudio);
pauseButton.addEventListener('click', pauseAudio);

volSlider.addEventListener('change', setVolume);
