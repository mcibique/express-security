'use strict';

let server = require('./server');
let sockets = require('./sockets');
let portHelper = require('../helpers/port');

const port = portHelper.normalize(process.env.PORT || '3000');

sockets.attachToServer(server, port);
server.listen(port);
