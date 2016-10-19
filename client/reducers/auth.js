import {api} from '../lib';

const INITAL_STATE = {
	token: '',
	expiry: 0,
	loggedIn: false,
};

const LOGIN = 'app/auth/LOGIN';
const LOGIN_FULFILLED = 'app/auth/LOGIN_FULFILLED';
const LOGIN_PENDING = 'app/auth/LOGIN_FULFILLED';
export const LOGIN_REJECTED = 'app/auth/LOGIN_REJECTED';
const REGISTER = 'app/auth/REGISTER';
const REGISTER_PENDING = 'app/auth/REGISTER_PENDING';
const REGISTER_FULFILLED = 'app/auth/REGISTER_FULFILLED';
export const REGISTER_REJECTED = 'app/auth/REGISTER_REJECTED';

export default function authReducer(state = INITAL_STATE, {type, payload = {}}) {
	switch (type) {
		case LOGIN_FULFILLED: {
			return {
				token: payload.token,
				expiry: (new Date(payload.expiry)).getTime(),
				loggedIn: true,
			};
		}
		default: {
			return state;
		}
	}
}

export function login(username, password) {
	return {
		type: LOGIN,
		payload: api.auth.login(username, password),
	};
}

export function rejectRegister(text) {
	return {
		type: REGISTER_REJECTED,
		payload: text,
	};
}
