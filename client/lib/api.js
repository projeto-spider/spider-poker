import axios from 'axios';

export function isExpired(expires) {
	return expires <= Math.floor(Date.now() / 1000) + 500;
}

export function request(url, options) {
	const req = axios({
		url,
		...options
	});

	if (options.rawResponse) {
		return req;
	}

	return req
		.then(({data}) => data);
}

['get', 'post', 'put', 'patch', 'head', 'delete']
	.forEach(method => {
		request[method] =
			(url, opts) => request(url, Object.assign({}, opts, {method}));
	});

const api = {
	organizations: {
		list(page) {
			return request.get('/api/organizations/', {
				body: {page},
			});
		},
	},
	auth: {
		valid(token) {
			return request.get('/api/auth/valid', {
				headers: {authorization: `Bearer ${token}`},
			});
		},
		login(username, password) {
			return request.post('/api/auth/authorize', {
				data: {username, password},
			});
		},
		register(data) {
			return request.post('/api/auth/register', {data});
		},
	},
};

export {api};
