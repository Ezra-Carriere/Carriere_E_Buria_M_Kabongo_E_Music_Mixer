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
                playAudio(audioElement);
            } else {
                audioElement.pause();
            }

            // Clone the image from the sound box
            const clonedImage = draggedElement.cloneNode(true);

            // Hide the playing box's original image
            const trackRef = this.querySelector('.track-ref');
            if (trackRef) {
                trackRef.style.display = 'none';
            }

            // Append the cloned image to the playing box
            this.appendChild(clonedImage);

            // Hide the original image in the sound box
            draggedElement.style.display = 'none';

            // Show the original image when moving back to a clear div
            if (this.classList.contains('box')) {
                draggedElement.style.display = 'block';
                clonedImage.classList.remove('track-ref');
            }

            // Remove the dragged image from the previous box
            draggedElement.parentNode.removeChild(draggedElement);

            // Make the cloned image draggable
            clonedImage.draggable = true;
            clonedImage.addEventListener('dragstart', handleDragStart);

             // Show the track icon back when moving the sound-box image back to the sound-box div
            
               if (this.classList.contains('box') && originalBox.classList.contains('dropBox')) {
                const originalTrackRef = originalBox.querySelector('.track-ref');
                if (originalTrackRef) {
                    originalTrackRef.style.display = 'block';
                }
            }
        }
    }
});

let lastPlayedAudio = null;

function playAudio(audioElement) {
    if (audioElement) {
        if (lastPlayedAudio && !lastPlayedAudio.ended) {
            lastPlayedAudio.addEventListener('ended', () => playAudio(audioElement));
        } else {
            audioElement.currentTime = 0;
            audioElement.play();
        }
        lastPlayedAudio = audioElement;
    }
}