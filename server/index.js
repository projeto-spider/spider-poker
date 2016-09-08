const koa = require('koa');
const router = require('koa-router')();

const app = koa();

router.get('/', function () {
	this.body = 'Hello Server';
});

app
	.use(router.routes())
	.use(router.allowedMethods());

const {
	PORT = 3000,
	HOST = '0.0.0.0'
} = process.env;

app.listen(PORT, HOST, () => {
	console.log(`Listening at ${HOST}:${PORT}`);
});

