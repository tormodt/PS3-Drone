var HID = require('node-hid');
var REPL = require('repl');

var repl = REPL.start('node-hid> ');
var hid = new HID.HID(34952, 776);

console.log('features', hid.getFeatureReport(0xf4, 17));

hid.gotData = function (err, data) {
    console.log('got ps3 data', data);
    this.read(this.gotData.bind(this));
}

hid.read(hid.gotData.bind(hid));

repl.context.hid = hid;
