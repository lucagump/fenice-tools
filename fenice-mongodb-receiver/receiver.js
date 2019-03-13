var mongo = require('./mongodb.js');
var mqtt = require('mqtt');
var os = require('os');

var config = require('./config/config.json');

var topic = config.mqtt.topic[0];
var hostname = config.mqtt.hostname;
var port = config.mqtt.port;
var mqttUri = 'mqtt://' + hostname + ':' + port;

var client = mqtt.connect(mqttUri);

console.log(" OS: " + os.type() + " " + os.release() + " (" + os.arch() + ")");
console.log("RAM: " + os.totalmem() / 1048576 + " MB (total), " + os.freemem() / 1048576 + " MB (free)");
console.log("CPU: " + os.cpus()[0].speed + " MHz " + os.cpus()[0].model + "\n");

client.on('connect', () => {
    console.log('Connecting to ' + topic + '...')
    client.subscribe(topic, function(err) {
        if (!err)
            console.log('Connected!')
    });

});

client.on('offline', () => {
    client.unsubscribe(topic);
    console.log('Disconnected from /' + topic + '.');
});

client.on('message', function(topic, message) {
    try {
        var json = JSON.parse(message);
        mongo.insertData(json);
        // console.log(json);
    } catch (error) {
        console.log('json bad format', error, message)
    }
});