import config from './config';
import IS_DEBUG from './debug';
import os from 'os';

let useCluster = false;
if (config.cluster === 'auto' && !IS_DEBUG) {
  useCluster = os.cpus().length;
} else if (config.cluster === true) {
  useCluster = os.cpus().length;
} else if (typeof config.cluster === 'number' && config.cluster > 0) {
  useCluster = Math.trunc(config.cluster);
}

export default useCluster;
