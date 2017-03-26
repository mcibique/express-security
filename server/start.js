import cluster from 'cluster';
import logger from './helpers/logger';
import { SERVER_PORT as PORT } from './helpers/port';
import useCluster from './helpers/cluster';

if (useCluster) {
  if (cluster.isMaster) {
    logger.info(`Running cluster's master. Number of CPUs: ${useCluster}`);
    forkWorkers(useCluster);
  } else {
    startWorker();
  }
} else {
  logger.info('Running without cluster.');
  startWorker();
}

function startWorker() {
  let server = require('./server').default;
  let sockets = require('./sockets');

  sockets.attachToServer(server, PORT);
  server.listen(PORT);
}

function forkWorkers(numberOfCpus) {
  for (let i = 0; i < numberOfCpus; i++) {
    let worker = cluster.fork();
    logger.info(`Forked new worker: ${worker.id}`);

    worker.on('exit', function onWorkedExited(code, signal) {
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
