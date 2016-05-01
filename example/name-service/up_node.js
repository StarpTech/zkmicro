'use strict';

var Zookeeper = require('node-zookeeper-client');

var Client = Zookeeper.createClient('localhost:2181');

Client.once('connected', function () {

    console.log('Connected to the server.');

    let serviceNodesPath = '/services/graph/nodes';
    let firstServiceNodePath = serviceNodesPath + '/node1';

    Client.mkdirp(serviceNodesPath, null, Zookeeper.CreateMode.PERSISTENT, function (error, path) {

        if (error) {
            console.log('Failed to create node: %s due to: %s.', path, error);
        }

        //Bootstrap service
        Client.create(firstServiceNodePath, new Buffer(JSON.stringify({url: 'http://127.0.0.1:8009'})), Zookeeper.CreateMode.EPHEMERAL, function (error, path) {

            if (error) {
                console.log('Failed to create node: %s due to: %s.', path, error);
            } else {
                console.log('Node: %s is successfully created.', path);
            }
        });

    });

});

function gracefulShutdown() {
    Client.close();
    process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

Client.connect();