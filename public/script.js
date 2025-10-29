const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const copyBtn = document.getElementById('copyBtn');

if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('roomId').value);
    alert('Room ID copied');
  });
}

const myVideo = document.createElement('video');
myVideo.muted = true;
let localStream;

async function init() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    addVideoStream(myVideo, localStream);

    socket.emit('join-room', ROOM_ID, socket.id);

    socket.on('user-connected', (userId) => {
      console.log('User connected', userId);
    });

    socket.on('user-disconnected', (userId) => {
      console.log('User disconnected', userId);
      const vid = document.getElementById('video-' + userId);
      if (vid && vid.parentElement) vid.parentElement.remove();
    });

    // Minimal example: this shows local video and join/disconnect events.
    // To full WebRTC P2P, use the more advanced client.js from earlier messages.
  } catch (err) {
    alert('Could not access camera/microphone: ' + err.message);
  }
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => video.play());
  videoGrid.append(video);
}

init();
