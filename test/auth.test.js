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
	// Username already exists
	t.throws(request.post('/api/auth/register', {
		body: {username: 'admin', email: 'foo@gmail.com', password: 'barbar'},
	}));

	// Email already exists
	t.throws(request.post('/api/auth/register', {
		body: {username: 'non-existent', email: 'admin@gmail.com', password: 'barfoo'},
	}));

	// Invalid username
	t.throws(request.post('/api/auth/register', {
		body: {username: 'foo bar', email: 'foo@gmail.com', password: 'barfoo'},
	}));

	// Weak password
	t.throws(request.post('/api/auth/register', {
		body: {username: 'foobar', email: 'foo@gmail.com', password: 'foo'},
	}));

	// Invalid email
	t.throws(request.post('/api/auth/register', {
		body: {username: 'foobar', email: 'foo', password: 'foo'},
	}));
});

test('Registration', async t => {
	await request.post('/api/auth/register/', {
		body: {username: 'foobar', email: 'foo@bar.com', password: 'foobar'},
	});

	const {token} = await request.post('/api/auth/authorize', {
		body: {username: 'foobar', password: 'foobar'},
	});

	const {valid} = await request.get('/api/auth/valid', {
		headers: {authorization: `Bearer ${token}`},
	});

	t.true(valid);
});

