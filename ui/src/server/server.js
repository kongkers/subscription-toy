import Koa from 'koa';
import koaStatic from 'koa-static';
import koaJson from 'koa-json';
import { koaBody } from 'koa-body';
import koaLogger from 'koa-logger';
import nconf from 'nconf';
import defaultRoutes from './routes/default.routes.js';
import { loadConfig} from './config/index.js';

loadConfig();

const app = new Koa();
const PORT = nconf.get('server:port');
app.use(koaLogger({
  transporter: (_str, [, method, url, status, time, length]) => {
    if (status !== undefined) {
      console.log(`${method} ${url} [${status}][${time} - ${length}]`);
    }
  },
}));
app.use(koaBody({
  jsonLimit: '5mb',
  multipart: true,
}));

app.use(koaJson());
app.use(koaStatic('dist/public'));
app.use(defaultRoutes.routes());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
