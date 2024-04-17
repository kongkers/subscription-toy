import KoaRouter from 'koa-router';
import defaultHandler from '../handlers/default.handler.js';

const router = new KoaRouter();

router.get('(.*)', defaultHandler);

export default router;

