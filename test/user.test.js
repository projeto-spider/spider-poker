import test from 'ava';
import {request} from './utils';

let token;

test.before('Get API token', async t => {
	const res = await request.post('/api/auth/authorize', {
		body: {username: 'admin', password: 'admin'},
	});

	token = res.token;
});

test('Index', async t => {
	const {data} = await request.get('/api/users');

	data
		.forEach(user => t.truthy(user.username));
});

test('Update', async t => {
	const bio = "Kono Dio da";
	const user = await request.put('/api/users/1', {
		headers: {authorization: `Bearer ${token}`},
		body: {bio},
	});

	t.is(user.profile.bio, bio);
});

test('Registration errors', async t => {
	t.throws(request.put('/api/users/2', {
		headers: {authorization: `Bearer ${token}`},
		body: {bio: 'foo'},
	}));

	t.throws(request.put('/api/users/1', {
		body: {bio: 'foo'},
	}));
});

