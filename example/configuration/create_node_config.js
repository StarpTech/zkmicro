'use strict';

var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');

client.once('connected', function () {

    console.log('Connected to the server.');

    //Create graph configuration
    client.mkdirp('/services/graph/config', new Buffer(JSON.stringify({ url: 'http://127.0.0.1:8010' })), function (error, stat) {

        if (error) {
            console.log(error.stack);
            return;
        }

        console.log('Data is set.');
    });

});

function gracefulShutdown() {
    client.close();
    process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

client.connect();