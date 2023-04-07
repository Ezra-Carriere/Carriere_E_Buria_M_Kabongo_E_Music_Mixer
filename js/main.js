document.addEventListener('DOMContentLoaded', function () {
    const soundBoxes = document.querySelectorAll('.box');
    const playingBoxes = document.querySelectorAll('.dropBox');
    const allBoxes = document.querySelectorAll('.box, .dropBox');
    const albumCovers = document.querySelectorAll(".box img");
    const theAudioEl = document.querySelector('audio');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    const rewindButton = document.querySelector('#rewindButton');
    const volSlider = document.querySelector('#volumeControl');
    const volumeDownButton = document.querySelector('#volumedownButton');
    const volumeUpButton = document.querySelector('#volumeupButton');

    allBoxes.forEach(box => {
        box.addEventListener('dragstart', handleDragStart);
    });

    allBoxes.forEach(box => {
        box.addEventListener('dragover', handleDragOver);
        box.addEventListener('drop', handleDrop);
    });

    let draggedElement = null;
    let originalBox = null;

    function handleDragStart(e) {
        if (e.target.classList.contains('track-ref')) {
            e.preventDefault();
            return;
        }
        draggedElement = e.target;
        originalBox = e.target.parentElement;
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDrop(e) {
        e.preventDefault();
        if (draggedElement.getAttribute('data-audio-id')) {
            const audioId = draggedElement.getAttribute('data-audio-id');
            const audioElement = document.getElementById(audioId);

            if (this.classList.contains('dropBox')) {
                playAudio(audioElement, this);
                this.setAttribute('data-audio-loop', audioId);
            } else {
                stopAudio(audioElement);
                this.removeAttribute('data-audio-loop');
            }

            const clonedImage = draggedElement.cloneNode(true);

            const trackRef = this.querySelector('.track-ref');
            if (trackRef) {
                trackRef.style.display = 'none';
            }

            this.appendChild(clonedImage);
            draggedElement.style.display = 'none';

            if (this.classList.contains('box')) {
                draggedElement.style.display = 'block';
                clonedImage.classList.remove('track-ref');
            }

            draggedElement.parentNode.removeChild(draggedElement);

            clonedImage.draggable = true;
            clonedImage.addEventListener('dragstart', handleDragStart);

            if (this.classList.contains('box')) {
                const originalTrackRef = originalBox.querySelector('.track-ref');
                if (originalTrackRef) {
                    originalTrackRef.style.display = 'block';
                }
                stopAudio(audioElement);
                originalBox.removeAttribute('data-audio-loop');
            }
        }
    }

    let audioLoopQueue = [];

    function playAudio(audioElement, playingBox) {
        if (audioElement) {
            const currentPlaying = audioLoopQueue.find(item => item.playingBox === playingBox);
            if (currentPlaying) {
                currentPlaying.audioElement.addEventListener('ended', () => {
                    stopAudio(currentPlaying.audioElement);
                    playAudio(audioElement, playingBox);
                });
                return;
            }

            const prevPlayingBox = getPrevPlayingBox(playingBox);
            const endedCallback = () => {
                audioElement.currentTime = 0;
                audioElement.play().then(() => {
                    audioElement.addEventListener('ended', endedCallback);
                });
            };

            if (prevPlayingBox) {
                const prevAudioId = prevPlayingBox.getAttribute('data-audio-loop');
                const prevAudioElement = document.getElementById(prevAudioId);
                prevAudioElement.addEventListener('ended', endedCallback);
} else {
audioElement.currentTime = 0;
audioElement.play().then(() => {
audioElement.addEventListener('ended', endedCallback);
});
}
audioLoopQueue.push({ audioElement, playingBox, endedCallback });
}
    }
function stopAudio(audioElement) {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        const audioLoopItem = audioLoopQueue.find(item => item.audioElement === audioElement);
        if (audioLoopItem) {
            const prevPlayingBox = getPrevPlayingBox(audioLoopItem.playingBox);
            if (prevPlayingBox) {
                const prevAudioId = prevPlayingBox.getAttribute('data-audio-loop');
                const prevAudioElement = document.getElementById(prevAudioId);
                if (prevAudioElement) {
                    prevAudioElement.removeEventListener('ended', audioLoopItem.endedCallback);
                }
            }
        }
        audioLoopQueue = audioLoopQueue.filter(item => item.audioElement !== audioElement);
    }
}

function getPrevPlayingBox(currentPlayingBox) {
    const playingBoxArray = Array.from(playingBoxes);
    const currentPlayingBoxIndex = playingBoxArray.indexOf(currentPlayingBox);

    if (currentPlayingBoxIndex > 0) {
        return playingBoxArray[currentPlayingBoxIndex - 1];
    } else {
        return null;
    }
}

playButton.addEventListener('click', function () {
    audioLoopQueue.forEach(item => {
        item.audioElement.play();
    });
});

pauseButton.addEventListener('click', function () {
    audioLoopQueue.forEach(item => {
        item.audioElement.pause();
    });
});

rewindButton.addEventListener('click', function () {
    audioLoopQueue.forEach(item => {
        item.audioElement.currentTime = 0;
    });
});

volSlider.addEventListener('input', function () {
    const volume = this.value / 100;
    audioLoopQueue.forEach(item => {
        item.audioElement.volume = volume;
    });
});

volumeDownButton.addEventListener('click', function () {
    let volume = volSlider.value - 5;
    if (volume < 0) {
        volume = 0;
    }
    volSlider.value = volume;
    audioLoopQueue.forEach(item => {
        item.audioElement.volume = volume / 100;
    });
});

volumeUpButton.addEventListener('click', function () {
    let volume = parseInt(volSlider.value) + 5;
    if (volume > 100) {
        volume = 100;
    }
    volSlider.value = volume;
    audioLoopQueue.forEach(item => {
        item.audioElement.volume = volume / 100;
    });
});

function showOverlay(overlayId) {
    document.getElementById(overlayId).style.display = "block";
}

function hideOverlay(overlayId) {
    document.getElementById(overlayId).style.display = "none";
}

document.getElementById("about").addEventListener("click", function () {
    showOverlay("aboutOverlay");
});

document.getElementById("rules").addEventListener("click", function () {
    showOverlay("rulesOverlay");
});

document.getElementById("info").addEventListener("click", function () {
    showOverlay("infoOverlay");
});

document.querySelectorAll(".overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (event) {
        if (event.target === this) {
            hideOverlay(this.id);
        }
    });
});

document.querySelectorAll(".close-btn").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        const overlay = event.target.closest(".overlay");
        if (overlay) {
            hideOverlay(overlay.id);
        }
    });
});
});