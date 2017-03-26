import config from 'config';
import cookieParser from 'cookie-parser';

export default cookieParser(config.secret);
