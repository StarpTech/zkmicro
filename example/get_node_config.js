'use strict';

var Zookeeper = require('node-zookeeper-client');
var Util = require('util');
var Client = Zookeeper.createClient('localhost:2181');

Client.once('connected', function () {

    console.log('Connected to the server.');

    let path = '/services/graph/config';

    function watcher(event) { //WATCHER

        console.log('Got watcher event: NODE_DELETED', event.getType() === Zookeeper.Event.NODE_DELETED);
        console.log('Got watcher event: NODE_CREATED', event.getType() === Zookeeper.Event.NODE_CREATED);
        console.log('Got watcher event: NODE_CHILDREN_CHANGED', event.getType() === Zookeeper.Event.NODE_CHILDREN_CHANGED);
        console.log('Got watcher event: NODE_DATA_CHANGED', event.getType() === Zookeeper.Event.NODE_DATA_CHANGED);

        //Create new watcher to watch permanently on changes
        Client.getData( path, watcher , getData );
    }
    function getData(error, data, stat) {

        if (error) {
            console.log(error.stack);
            return;
        }

        console.log('Got data: %s', Util.inspect(JSON.parse(data.toString())));

    }

    //Get configuration for the graph service and watch on changes
    Client.getData( path, watcher , getData );

});

function gracefulShutdown() {
    Client.close();
    process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

Client.connect();