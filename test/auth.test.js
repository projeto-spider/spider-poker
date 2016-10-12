import test from 'ava';
import {request} from './utils';

test('Unauthorized', async t => {
	const {valid} = await request.get('/api/auth/valid');
	t.false(valid);
});

test('Authorization', async t => {
	const {token} = await request.post('/api/auth/authorize', {
		body: {username: 'admin', password: 'admin'},
	});

	const {valid} = await request.get('/api/auth/valid', {
		headers: {authorization: `Bearer ${token}`},
	});
	t.true(valid);
});

test('Registration errors', async t => {
	t.throws(request.post('/api/auth/register', {
		body: {username: 'admin', email: 'foo@gmail.com', password: 'bar'},
	}));

	t.throws(request.post('/api/auth/register', {
		body: {username: 'non-existent', email: 'admin@gmail.com', password: 'bar'},
	}));
});

test('Registration', async t => {
	await request.post('/api/auth/register/', {
		body: {username: 'foo', email: 'foo@bar.com', password: 'bar'},
	});

	const {token} = await request.post('/api/auth/authorize', {
		body: {username: 'foo', password: 'bar'},
	});

	const {valid} = await request.get('/api/auth/valid', {
		headers: {authorization: `Bearer ${token}`},
	});

	t.true(valid);
});

