import { IS_DEBUG } from 'config';
import logger from 'logger';
import morgan from 'morgan';

let stream = {
  write(message /* , encoding */) {
    logger.info(message.slice(0, -1));
  }
};

export default morgan(IS_DEBUG ? 'common' : 'combined', { stream });
