//creating visualization
//audioContext is used to control the web audio api
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//audio element
const audioElement = document.querySelector("audio");
//canvas element
const canvasElement = document.querySelector("canvas");
const playPauseButton = document.querySelector(".play-pause");
const seekBar = document.querySelector(".seekbar");
const volumeBar = document.querySelector(".volume");
const canvas = document.querySelector(".canvas");

//changing the button Icons when we stop and pause and replay
const pauseIcon = `<span class="material-icons"> pause</span>`;
const playIcon = `<span class="material-icons"> play_arrow</span>`;
const replayIcon = `<span class="material-icons"> replay</span>`;

//creating canvas context
const canvasContext = canvasElement.getContext("2d");
//by using canvas context we can draw the graph in canvas element

//getting canvas height and width
const width = canvasElement.clientWidth;
const height = canvasElement.clientHeight;

//Web audio api gives the graph of the audio like frequency and modulation and all
//for this we need a source
const source = audioContext.createMediaElementSource(audioElement);

//for getting the frequency we need analyser
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

//initially we are kept the seekBar and volume bar to 0
seekBar.value = 0;
volumeBar.value = 100;

//state of the audio
const audioState = {
	isReplay: false,
	isPaused: true,
};

//adding event to button to toggle (play and pause)
playPauseButton.addEventListener("click", togglePlayPause);

//calculating the time and added the progress , onend and duration
audioElement.addEventListener("timeupdate", setProgress);
audioElement.addEventListener("ended", onEnd);
audioElement.addEventListener("canplay", setDuration);

//adding events to custom play song and volume
seekBar.addEventListener("input", onSeek);
volumeBar.addEventListener("input", onVolumeSeek);
canvas.addEventListener("click", onSeek);

//In web audio api ,firstly we need to connect the graphs , we are created the notes above already
source.connect(analyser);
analyser.connect(audioContext.destination); //to speakers

// bufferLength is all about number of bins we have ,each bin has a certain frequency
const bufferLength = analyser.frequencyBinCount;
//Uint8Array----array of integers of 8bit long(1byte --long) those are also unsigned...
const dataArray = new Uint8Array(bufferLength);

function draw(e) {
	analyser.getByteFrequencyData(dataArray);
	//filling canvas with background-color gray
	canvasContext.fillStyle = `gray`;
	//creating a square box to showing the frequencies
	canvasContext.fillRect(0, 0, width, height);

	//calculating the barWidth using width and bufferLength with constant frequency
	const barWidth = width / bufferLength;
	let barHeight;
	let x = 0;

	for (let i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i] * 2;
		//filling up the canvas with chocolate color
		canvasContext.fillStyle = `chocolate`;

		//creating the rectangular boxes to modulating the frequencies
		canvasContext.fillRect(x, height - barHeight, barWidth, barHeight);
		//updating the x with batWidth based on the frequencies
		x += barWidth + 1;
	}

	// audioElement.currentTime = e.target.value;

	//calling the function everyTime and added animations
	requestAnimationFrame(draw);
}

draw();

//function for toggling the Audio
function togglePlayPause() {
	audioContext.resume().then(() => {
		if (audioState.isPaused) {
			playPauseButton.innerHTML = pauseIcon;
			audioElement.play();
		} else {
			if (audioState.isReplay) {
				playPauseButton.innerHTML = pauseIcon;
				audioElement.play();
				audioState.isReplay = false;
				return;
			}

			playPauseButton.innerHTML = playIcon;
			audioElement.pause();
		}

		audioState.isPaused = !audioState.isPaused;
	});
}

//function for setting up progress when audio player starts
function setProgress() {
	seekBar.value = audioElement.currentTime;
}

//function for updating the duration
function setDuration() {
	seekBar.max = audioElement.duration;
}

//function for ending the audio and updating the seekBar and setting up everything to zero
function onEnd() {
	playPauseButton.innerHTML = replayIcon;
	audioElement.currentTime = 0;
	seekBar.value = 0;
	audioState.isReplay = true;
}

//function for custom selection for audio

function onSeek(e) {
	audioElement.currentTime = e.target.value;
}

//function for custom audio

function onVolumeSeek(e) {
	audioElement.volume = e.target.value / 100;
}
