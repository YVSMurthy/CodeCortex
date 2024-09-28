const Sound = require('react-native-sound');

// Set the category for audio playback
Sound.setCategory('Playback');

// Function to play audio once
const playAudio = (verify) => {
  // Choose the sound file based on the condition
  const soundFile = verify ? 'correct.mp3' : 'invalid.mp3';

  // Load the sound file
  const whoosh = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }

    // Play the sound
    whoosh.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }

      // Release the sound resource after playback finishes
      whoosh.release();
    });
  });
};

module.exports = {playAudio: playAudio}