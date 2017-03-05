import IS_DEBUG from '../helpers/debug';
import logger from '../helpers/logger';
import morgan from 'morgan';

let stream = {
  write(message /* , encoding */) {
    logger.info(message.slice(0, -1));
  }
};

export default morgan(IS_DEBUG ? 'common' : 'combined', { stream });
