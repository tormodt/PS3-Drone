var HID = require('node-hid');
var arDrone = require('ar-drone');

var devices = HID.devices();
var path = devices[devices.length - 1].path;
var ps3 = new HID.HID(path);

var drone = arDrone.createClient();

var speed = 0.5;
var time;
var sequence = [];
var recording = false;
var record;

drone.disableEmergency();

record = function(action) {
	if (sequence.length > 0) {
		sequence[sequence.length - 1].time = new Date().getTime() - time;
	}
	sequence.push({'time': 0, 'action': action});
	time = new Date().getTime();
};

ps3.on('data', function(data) {
	var json = data.toJSON();

	if (data[3] === 128 && data[4] === 0) {
		// Up
		drone.front(speed);
		console.log('Forward');
		record('forward');
	} else if (data[3] === 128 && data[4] === 255) {
		// Down
		drone.back(speed);
		console.log('Backwards');
		record('backwards');
	} else if (data[3] === 0 && data[4] === 128) {
		// Left
		drone.left(speed);
		console.log('Left');
		record('left');
	} else if (data[3] === 255 && data[4] === 128) {
		// Right
		drone.right(speed);
		console.log('Right');
		record('right');
	} else if (data[0] === 1) {
		// Triangle
		drone.takeoff();
		console.log('Takeoff');
		record('takeoff');
	} else if (data[0] === 2) {
		// Square
		drone.animate('flipRight', 500);
		console.log('Flip right');
		record('flipright');
	} else if (data[0] === 4) {
		// X
		drone.land();
		console.log('Land');
		record('land');
		//console.log(sequence);
	} else if (data[0] === 8) {
		// Circle
		drone.animate('flipLeft', 500);
		console.log('Flip left');
		record('flipleft');
	} else if (data[0] === 16) {
		// L1
		drone.down(speed);
		console.log('Down');
		record('down');	
	} else if (data[0] === 32) {
		// R1
		drone.up(speed);
		console.log('Up');
		record('up');
	} else if (data[0] === 64) {
		// L2
		drone.counterClockwise(speed);
		console.log('CounterClockwise');
		record('counterClockwise');
	} else if (data[0] === 128) {
		// R2
		drone.clockwise(speed);
		console.log('Clockwise');
		record('clockwise');	
	} else if (data[0] === 0 && data[3] === 128 && data[4] === 128) {
		// No buttons pushed
		drone.stop();
		console.log('Stop');
		record('stop');
		//console.log(sequence);
	} else {
		console.log('wtf: ' + json);
	}
	console.log(json);
});

ps3.on('error', function(err) {
	console.log(err);
});



/*
ps3Stream.on('data', function(data) {
	var keyCodes = data.keyCodes;
	console.log(keyCodes);
});
*/
