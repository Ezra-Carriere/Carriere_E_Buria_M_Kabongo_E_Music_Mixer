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

            if (this.classList.contains('box') && originalBox.classList.contains('dropBox')) {
                const originalTrackRef = originalBox.querySelector('.track-ref');
                if (originalTrackRef) {
                    originalTrackRef.style.display = 'block';
                }
            }
        }
    }

    let audioLoopQueue = [];

    function playAudio(audioElement, playingBox) {
    if (audioElement) {
        // Check if there's another sound playing in the loop
        const currentPlaying = audioLoopQueue.find(item => item.playingBox === playingBox);
        if (currentPlaying) {
            currentPlaying.audioElement.addEventListener('ended', () => {
                const prevPlayingBox = getPrevPlayingBox(playingBox);
                if (prevPlayingBox) {
                    const prevAudioId = prevPlayingBox.getAttribute('data-audio-loop');
                    const prevAudioElement = document.getElementById(prevAudioId);
                    prevAudioElement.addEventListener('ended', () => {
                        stopAudio(currentPlaying.audioElement);
                        playAudio(audioElement, playingBox);
                    });
                    prevAudioElement.currentTime = 0;
                    prevAudioElement.play();
                }
            });
            return;
        }

        audioElement.currentTime = 0;
        audioElement.play().then(() => {
            audioElement.addEventListener('ended', () => {
                audioElement.currentTime = 0;
                audioElement.play();
            });
        });

        audioLoopQueue.push({ audioElement, playingBox });
    }
}

    function stopAudio(audioElement) {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
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
});


