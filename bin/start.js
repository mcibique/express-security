'use strict';

const useCluster = require('../helpers/cluster');
const logger = require('../helpers/logger');

if (useCluster) {
  let cluster = require('cluster');
  if (cluster.isMaster) {
    logger.info(`Running cluster's master. Number of CPUs: ${useCluster}`);
    forkWorkers(cluster, useCluster);
  } else {
    startWorker();
  }
} else {
  logger.info('Running without cluster.');
  startWorker();
}

function startWorker() {
  let server = require('./server');
  let sockets = require('./sockets');
  let portHelper = require('../helpers/port');

  const port = portHelper.normalize(process.env.PORT || '3000');

  sockets.attachToServer(server, port);
  server.listen(port);
}

function forkWorkers(cluster, numberOfCpus) {
  for (let i = 0; i < numberOfCpus; i++) {
    let worker = cluster.fork();
    logger.info(`Forked new worker: ${worker.id}`);

    worker.on('exit', (code, signal) => {
      if (signal) {
        logger.error(`Worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        logger.error(`Worker exited with error code: ${code}`);
      } else {
        logger.info('Worker success!');
      }
    });
  }
}
