'use strict';
const Koa = require('koa');
const Router = require('@koa/router'); 
const serve = require('koa-static');
const session = require('koa-session');
const path = require('path');
const app = new Koa();
const router = new Router();
const initApi  = require("./api/index.js");
var staticDirPath = path.join(__dirname, 'public');
var DEVELOPER_MODE = 0; 

app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: false, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  secure: true, /** (boolean) secure cookie*/
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};
app.use(session(app));
// app.use(session(CONFIG, app));

/***
* server static file html, Js, css and images.
*/
app.use(serve(staticDirPath));

/***
* response after api two param handle that control
*/
router.all('koa-example', '/api/:id/:id/:id', (ctx) => { 
	initApi.process(ctx);	
	//ctx.body  = "api "
});
  
router.get('error', '/error', (ctx) => {
  ctx.throw(500, 'internal server error 111');
});
 
//Error handling middleware
app.use(function *(next) {
	if(!DEVELOPER_MODE)
	{
		yield next;
		return 0;
	}
   try {
      yield next;
   } catch (err) {
      this.status = err.status || 500;
      this.body = err.message;
      this.app.emit('error', err, this);
   }
});
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(1101);
 