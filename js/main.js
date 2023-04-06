const albumCovers = document.querySelectorAll(".box img"),
      theAudioEl = document.querySelector('audio'),
      playButton = document.querySelector('#playButton'),
      pauseButton = document.querySelector('#pauseButton'),
      rewindButton = document.querySelector('#rewindButton'),
      volSlider = document.querySelector('#volumeControl');

const soundBoxes = document.querySelectorAll(".box"),
      dropBoxes = document.querySelectorAll(".dropBox");

let draggedElement = null;

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
    theAudioEl.volume = (this.value/100); 
}

function handleDragStart(e) {
    draggedElement = this;
    e.dataTransfer.setData('text/plain', '');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();

    if (draggedElement) {
        this.appendChild(draggedElement);
        this.querySelector('.track-ref').style.display = 'none';
    }
}

albumCovers.forEach(cover => cover.addEventListener('click', loadAudio));

playButton.addEventListener('click', playAudio);
rewindButton.addEventListener('click', restartAudio);
pauseButton.addEventListener('click', pauseAudio);

volSlider.addEventListener('change', setVolume);

soundBoxes.forEach(soundBox => soundBox.addEventListener('dragstart', handleDragStart));
soundBoxes.forEach(soundBox => soundBox.setAttribute('draggable', 'true'));

dropBoxes.forEach(dropBox => dropBox.addEventListener('dragover', handleDragOver));
dropBoxes.forEach(dropBox => dropBox.addEventListener('drop', handleDrop));