//created a wave and if song is played then progress wave will covered
var audioTrack = WaveSurfer.create({
	container: ".audio",
	waveColor: "gray",
	progressColor: "crimson",
	barWidth: 2,
});

//importing audio track
audioTrack.load("./bensound-funkyelement.mp3");

//Getting element using querySelector to control the play and pause the song
const playBtn = document.querySelector(".play-btn");
const stopBtn = document.querySelector(".stop-btn");
const canvas = document.querySelector(".canvas");

//play function
playBtn.addEventListener("click", () => {
	audioTrack.playPause();

	if (audioTrack.isPlaying()) {
		playBtn.classList.add("playing");
	} else {
		playBtn.classList.remove("playing");
	}
});

//stop function

stopBtn.addEventListener("click", () => {
	audioTrack.stop();
	playBtn.classList.remove("playing");
});
