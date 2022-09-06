import { app } from './config/app.config.js';
import { serverHttp } from './config/socketio.config.js';

serverHttp.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});
serverHttp.on('error', (error) => {
  console.log(error);
});
