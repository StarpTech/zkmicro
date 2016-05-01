'use strict';

var Zookeeper = require('node-zookeeper-client');
var Util = require('util');
var Client = Zookeeper.createClient('localhost:2181');

Client.once('connected', function () {

    console.log('Connected to the server.');

    let path = '/services/graph/nodes';

    function watcher(event) { //WATCHER

        console.log('Event type %s', event.getName());

        //Create new watcher to watch permanently on changes
        Client.getChildren( path, watcher , getData );
    }
    function getData(error, data, stat) {

        if (error) {
            console.log(error.stack);
            return;
        }

        if(data) {
            console.log('Got active nodes: %s', data.toString('utf8'));
        }

    }

    //Get active nodes for the graph service and watch on changes
    Client.getChildren( path, watcher , getData );

});

function gracefulShutdown() {
    Client.close();
    process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

Client.connect();