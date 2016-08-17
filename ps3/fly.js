var HID = require('node-hid');
var arDrone = require('ar-drone');

var devices = HID.devices();
var path = devices[devices.length - 1].path;
var ps3 = new HID.HID(path);

var drone = arDrone.createClient();

var speed = 0.5;

drone.disableEmergency();

ps3.on('data', function(data) {
	var json = data.toJSON();

	if (data[3] === 128 && data[4] === 0) {
		// Up
		drone.front(speed);
		console.log('Forward');
	} else if (data[3] === 128 && data[4] === 255) {
		// Down
		drone.back(speed);
		console.log('Backwards');
	} else if (data[3] === 0 && data[4] === 128) {
		// Left
		drone.left(speed);
		console.log('Left');
	} else if (data[3] === 255 && data[4] === 128) {
		// Right
		drone.right(speed);
		console.log('Right');
	} else if (data[0] === 1) {
		// Triangle
		drone.takeoff();
		console.log('Takeoff');
	} else if (data[0] === 2) {
		// Square
		drone.animate('flipLeft', 1000);
		console.log('Flip left');
	} else if (data[0] === 4) {
		// X
		drone.land();
		console.log('Land');
	} else if (data[0] === 8) {
		// Circle
		drone.animate('flipRight', 1000);
		console.log('Flip right');
	} else if (data[3] === 128 && data[4] === 128) {
		// No buttons pushed
		drone.stop();
		drone.disableEmergency();
		console.log('Hover');
	} else {
		console.log(json);
	}
});

ps3.on('error', function(err) {
	console.log(err);
});
