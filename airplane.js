var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var planeX;
var planeY;
var xA = new Array();
var yA = new Array();
var dY = 10;
var flyUp = true;
var n = 0;
var xmin = -10;
var xmax = 10;
var ymin = -50;
var ymax = 50;
var xorig = 30;
var yorig = 241;
var xwidth = 375;
var ywidth = 281;
var xscal;
var yscal;
var idInterval;
var airplaneIndex = 0;
var airplaneInterval;
var gameState;
var timeCount;
var imageBackground = new Image();
var imageAirplane = new Image();

var axisYNumber = new Array();
var axisXNumber = new Array();//
const NUM_VERTICAL_TICKS = 21;//201 / 10;
const NUM_HORIZONTAL_TICKS = 30;//295 / 10;

const TICKS_LINEWIDTH = 0.5;
const TICKS_COLOR = '#ffffff';

const AXIS_LINEWIDTH = 1.0;
const AXIS_COLOR = '#ffffff';


window.onload = init;
/////////////////////////////////////////////////////
function init() {
	timeCount = 1;	
	target2Coordinate(18);
	// timeCoordinate();
	initData();
	assetInit();
	setupTimer();
}

function assetInit() {
	imageBackground.src = "background.png";
	imageAirplane.src = "plane.png";
}

function initData() {
	for (let i = 1; i < 5; i++) {
		axisXNumber[i - 1] = i;		
	}
	xscal = (xmax - xmin) / xwidth;
	yscal = (ymax - ymin) / ywidth;
	for (var i = 0; i <= 500; i++) {
		xA[i] = (i) * 0.029;
		yA[i] = 0.275 * (xA[i] * xA[i]);
	}
	//updownY = -yA[500] / yscal + yorig;
}

function setupTimer() {
	idInterval = setInterval(() => {
		
		// if (State of Game === "GAMEEND") {
		// 	airplaneInterval = setInterval(() => {
		// 		flyAirplane();
		// 	}, 2);
		// }
		if (n >= xA.length) {
			idInterval = setInterval(() => {
				stayAirplane();
				stayline();
				clearInterval(idInterval);
			}, 20);
		} else {
			moveAirplane();
			moveline();
		}
		timeCoordinate();
	}, 10);
}

function moveAirplane() {
	planeX = xA[n] / xscal + xorig;
	planeY = -yA[n] / yscal + yorig;
	const startPosX = xA[0] / xscal + xorig;
	const startPosY = -yA[0] / yscal + yorig;
	const lastPosX = xA[500] / xscal + xorig;
	const lastPosY = -yA[500] / yscal + yorig;
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawAxes();
	drawAxisLabels();
	context.drawImage(imageBackground, 0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.moveTo(startPosX, startPosY);
	context.bezierCurveTo(startPosX,
		startPosY,
		Math.floor((((xA[n] - xA[0]) / xscal + 2 * xorig)) / 2),
		startPosY
		, planeX, planeY
	);

	context.bezierCurveTo(
		planeX, planeY,
		planeX, planeY,
		planeX, startPosY
	);

	// Create gradient
	const grd = context.createLinearGradient(lastPosX, startPosY, lastPosX, lastPosY);//265, 210, 265, 41
	// if (Number(Number(targetNumber).toFixed(2)) == 2.00) {
	// 	grd.addColorStop(0.2, "rgba(0, 190, 76, 0)");
	// 	grd.addColorStop(1, "rgba(0, 190, 76, 1)");
	// } else if (Number(Number(targetNumber).toFixed(2)) == 10.00) {
	// 	grd.addColorStop(0.2, "rgba(239, 200, 76, 0)");
	// 	grd.addColorStop(1, "rgba(239, 200, 76, 1)");
	// }
	grd.addColorStop(0.05, "rgba(255, 107, 0, 0)");
	grd.addColorStop(1, "rgba(255, 107, 0, 1)");
	context.globalCompositeOperation = "lighter";

	// Fill with gradient
	context.fillStyle = grd;
	context.fill();
	//Fly Airplane	
	context.drawImage(imageAirplane, planeX - 38, planeY - 53);
}

function moveline() {
	context.strokeStyle = "#fff";
	context.lineWidth = 3;
	context.beginPath();
	context.moveTo(xA[0] / xscal + xorig, -yA[0] / yscal + yorig);
	context.bezierCurveTo(xA[0] / xscal + xorig,
		-yA[0] / yscal + yorig,
		Math.floor((((xA[n] - xA[0]) / xscal + 2 * xorig)) / 2),
		-yA[0] / yscal + yorig
		, planeX, planeY
	);
	context.stroke();
	n++;
}

function stayAirplane() {
	const startPosX = xA[0] / xscal + xorig;
	const startPosY = -yA[0] / yscal + yorig;
	const lastPosX = xA[500] / xscal + xorig;
	const lastPosY = -yA[500] / yscal + yorig;
	if (flyUp) planeY -=0.05;
	else planeY +=0.05;
	if (Number(planeY).toFixed(2) == Number(lastPosY - dY).toFixed(2)) flyUp = false;
	if (Number(planeY).toFixed(2) == Number(lastPosY).toFixed(2)) flyUp = true;

	context.clearRect(0, 0, canvas.width, canvas.height);
	drawAxes();
	drawAxisLabels();
	context.drawImage(imageBackground, 0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.moveTo(startPosX, startPosY);
	context.bezierCurveTo(startPosX,
		startPosY,
		Math.floor((((xA[500] - xA[0]) / xscal + 2 * xorig)) / 2),
		startPosY,
		lastPosX,
		planeY
	);
	context.bezierCurveTo(
		lastPosX, planeY,
		lastPosX, planeY,
		lastPosX, startPosY
	);

	// // Create gradient
	const grd = context.createLinearGradient(lastPosX, startPosY, lastPosX, lastPosY);
	grd.addColorStop(0.2, "rgba(255, 107, 0, 0)");
	grd.addColorStop(1, "rgba(255, 107, 0, 1)");
	context.globalCompositeOperation = "lighter";

	// Fill with gradient
	context.fillStyle = grd;
	context.fill();
	//Fly Airplane	
	context.drawImage(imageAirplane, lastPosX - 38, planeY - 53);
}

function stayline() {
	const startPosX = xA[0] / xscal + xorig;
	const startPosY = -yA[0] / yscal + yorig;
	const lastPosX = xA[500] / xscal + xorig;
	const lastPosY = -yA[500] / yscal + yorig;
	if (flyUp) planeY -=0.05;
	else planeY +=0.05;
	if (Number(planeY).toFixed(2) == Number(lastPosY - dY).toFixed(2)) flyUp = false;
	if (Number(planeY).toFixed(2) == Number(lastPosY).toFixed(2)) flyUp = true;
	context.strokeStyle = "#fff";
	context.lineWidth = 3;
	context.beginPath();
	context.moveTo(startPosX, startPosY);
	context.bezierCurveTo(startPosX,
		startPosY,
		Math.floor((((xA[500] - xA[0]) / xscal + 2 * xorig)) / 2),
		startPosY,
		lastPosX,
		planeY
	);
	context.stroke();
}

//////////////////////////////////////////////////////////////////////

function drawAxes() {
	context.save();
	context.strokeStyle = AXIS_COLOR;
	context.lineWidth = AXIS_LINEWIDTH;

	drawHorizontalAxis();
	drawVerticalAxis();

	context.lineWidth = TICKS_LINEWIDTH;
	context.strokeStyle = TICKS_COLOR;

	drawVerticalAxisTicks();
	context.restore();
}

function drawHorizontalAxis() {
	context.beginPath();
	context.moveTo(30, 241);
	context.lineTo(335, 241);
	context.stroke();
}

function drawVerticalAxis() {
	context.beginPath();
	context.moveTo(30, 241);
	context.lineTo(30, 30);
	context.stroke();
}

function drawVerticalAxisTicks() {
	let deltaY;

	for (let i = 1; i < NUM_VERTICAL_TICKS; ++i) {
		context.beginPath();

		if (i % 6 === 0) {
			deltaY = 5;
			context.moveTo(
				30,
				241 - i * 10
			);

			context.lineTo(
				30 + 2 * deltaY,
				241 - i * 10
			);
		}

		context.stroke();
	}
}

function drawAxisLabels() {
	context.fillStyle = '#ffffff';
	drawHorizontalAxisLabels();
	drawVerticalAxisLabels();
}

function drawHorizontalAxisLabels() {
	context.textAlign = 'center';
	context.textBaseline = 'top';

	for (let i = 0; i <= NUM_HORIZONTAL_TICKS; ++i) {
		if (i === 0) continue;
		if (i % 7 === 0) {
			context.fillText(
				axisXNumber[i / 7 - 1].toString(),
				30 + i * 10,
				241 + 10
			);
		}
	}
}

function drawVerticalAxisLabels() {
	context.textAlign = 'right';
	context.textBaseline = 'middle';
	context.fillText(
		'0'.toString(),
		30 - 10,
		241 - 10
	);
	for (let i = 1; i <= NUM_VERTICAL_TICKS; ++i) {
		if (i % 7 === 0) {
			context.fillText(
				axisYNumber[i / 7 - 1].toString() + 'x',
				30 - 10 + 5,
				241 - i * 8.5
			);
		}
	}
}

/////////////////////////////////////////////////////
function target2Coordinate(input_num) {
	// if bigger than detection_number
	var temp;
	temp = Number(input_num) / 3;
	axisYNumber[0] = temp;
	axisYNumber[1] = 2 * temp;
	axisYNumber[2] = 3 * temp;
}

function timeCoordinate() {	 
	var target = 3;
	var dt = Number(0.01*timeCount).toFixed(0);
	if (target>2 && dt >= 1) {
		axisXNumber[0] = dt;
		axisXNumber[1] = 2*dt;
		axisXNumber[2] = 3*dt;
		axisXNumber[3] = 4*dt;
	}
	timeCount++;
}
/////////////////////////////////////////////////////
function flyAirplane() {	
	// const startPosX = xA[0] / xscal + xorig;
	// const startPosY = -yA[0] / yscal + yorig;
	// const airplanePosX = startPosX - 38;
	// const airplanePosY = startPosY - 53;
	const airplanePosX = planeX - 38;
	const airplanePosY = planeY - 53;
	const k = (airplanePosY - 30) /(241 - airplanePosX);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(imageBackground, 0, 0, canvas.width, canvas.height);
	context.drawImage(imageAirplane, airplanePosX + airplaneIndex, airplanePosY - k*airplaneIndex);
	airplaneIndex++;
	if((airplanePosX + airplaneIndex) > 400) {
		clearInterval(airplaneInterval);
	}
}
/////////////////////////////////////////////////////