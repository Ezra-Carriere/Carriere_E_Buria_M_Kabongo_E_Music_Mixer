document.addEventListener('DOMContentLoaded', function() {
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

    function handleDragStart(e) {
        draggedElement = e.target;
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

        if (draggedElement) {
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
            }

            // Remove the dragged image from the previous box
            draggedElement.parentNode.removeChild(draggedElement);

            // Make the cloned image draggable
            clonedImage.draggable = true;
            clonedImage.addEventListener('dragstart', handleDragStart);

            // Hide the track icon in the playing box when dropping a sound-box image
            if (this.classList.contains('dropBox') && trackRef) {
                trackRef.style.display = 'none';
            }

            // Show the track icon back when moving the sound-box image back to the sound-box div
            if (this.classList.contains('box')) {
                const originalPlayingBox = Array.from(playingBoxes).find(box => box.contains(draggedElement));
                if (originalPlayingBox) {
                    const originalTrackRef = originalPlayingBox.querySelector('.track-ref');
                    if (originalTrackRef) {
                        originalTrackRef.style.display = 'block';
                    }
                }
            }
        }
    }

    // Add your event listeners for play, pause, rewind, and volume control here
});