import config from '../helpers/config';
import cookieParser from 'cookie-parser';

export default cookieParser(config.secret);
