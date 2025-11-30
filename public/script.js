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
