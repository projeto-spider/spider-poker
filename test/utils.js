import got from 'got';

const {HOST, PORT} = process.env;

export function request(url, options) {
	const req = got(`http://${HOST}:${PORT}${url}`, options);

	if (options.rawResponse) {
		return req;
	}

	return req
		.then(({body}) => JSON.parse(body));
}

['get', 'post', 'put', 'patch', 'head', 'delete']
	.forEach(method => {
		request[method] =
			(url, opts) => request(url, Object.assign({}, opts, {method}));
	});

