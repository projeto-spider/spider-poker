import {LOGIN_REJECTED, REGISTER_REJECTED} from './auth';

const INITIAL_STATE = [];

// Action types
export const CLEAR = 'app/flash/CLEAR';
// Message types
export const FLASH_ALL = 'app/scope/FLASH_ALL';
export const AUTH_INVALID = 'app/flash/AUTH_INVALID';
// Flash message levels
export const FLASH_INFO = 'app/flash/FLASH_INFO';
export const FLASH_WARNING = 'app/flash/FLASH_WARNING';
export const FLASH_ERROR = 'app/flash/FLASH_ERROR';

export default function flashReducer(state = INITIAL_STATE, {type, payload = {}}) {
	switch(type) {
		case CLEAR: {
			const type = payload;

			if (type === FLASH_ALL) {
				return [];
			}

			return state
				.filter(message => message.type !== type);
		}
		case LOGIN_REJECTED: {
			return [
				...state,
				{
					type: AUTH_INVALID,
					level: FLASH_ERROR,
					text: 'Invalid credentials',
				},
			];
		}
		case REGISTER_REJECTED: {
			return [
				...state,
				{
					type: AUTH_INVALID,
					level: FLASH_ERROR,
					text: payload,
				},
			];
		}
		default: {
			return state;
		}
	}
}

export function clear(type = FLASH_ALL) {
	return {
		type: CLEAR,
		payload: type,
	};
}
