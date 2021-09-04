//creating visualization
//audioContext is used to control the web audio api
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//audio element
const audioElement = document.querySelector("audio");
//canvas element
const canvasElement = document.querySelector("canvas");


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

//In web audio api ,firstly we need to connect the graphs , we are created the notes above already
source.connect(analyser);
analyser.connect(audioContext.destination); //to speakers

// bufferLength is all about number of bins we have ,each bin has a certain frequency
const bufferLength = analyser.frequencyBinCount;
//Uint8Array----array of integers of 8bit long(1byte --long) those are also unsigned...
const dataArray = new Uint8Array(bufferLength);

const draw = () => {
	analyser.getByteFrequencyData(dataArray);
	canvasContext.fillStyle = `rgb(2 , 2, 2)`;
	canvasContext.fillRect(0, 0, width, height);

	const barWidth = (width / bufferLength) * 2.5;
	let barHeight;
	let x = 0;

	for (let i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i] / 2.8;
		canvasContext.fillStyle = `rgb(50,50,200)`;
		canvasContext.fillRect(x, height - barHeight, barWidth, barHeight);
		x += barWidth + 1;
	}

	requestAnimationFrame(draw);
};

draw();
