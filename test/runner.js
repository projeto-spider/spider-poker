const exec = require('child_process').exec;
const path = require('path');
const bootstrap = require('./bootstrap');

bootstrap(Server => {
	Server.listen(process.env.HOST, process.env.PORT);

	const ace = 'node --harmony_proxies ace';
	const ava = './node_modules/.bin/ava';
	const commands = [
		'rm -f database/test.sqlite',
		`${ace} migration:run`,
		`${ace} db:seed`,
		`${ava} test/**/*.test.js`,
	].join(' && ');

	exec(commands, {
		cwd: path.join(__dirname, '../'),
	}, (err, stdin, stdout) => {
		Server.getInstance().close();

		if (err) {
			throw err;
		}

		console.log(stdin);
		console.log(stdout);

		// eslint-disable-next-line
		process.exit(0);
	});
});

