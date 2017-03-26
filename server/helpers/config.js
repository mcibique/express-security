import extend from 'extend';
import fs from 'fs';
import path from 'path';

export const IS_DEBUG = process.env.NODE_ENV === 'development';

export const DEV_CONFIG_PATH = path.resolve(__dirname, '..', 'config', 'config.dev.json');
export const DEFAULT_CONFIG_PATH = path.resolve(__dirname, '..', 'config', 'config.json');

let config;
let defaultConfig = require(DEFAULT_CONFIG_PATH);

if (IS_DEBUG && fs.existsSync(DEV_CONFIG_PATH)) {
  let devConfig = require(DEV_CONFIG_PATH);
  config = extend(true, {}, defaultConfig, devConfig);
} else {
  config = defaultConfig;
}

export default config;
