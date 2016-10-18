import store from '../../store';

export default function notLoggedIn(_nextState, replace) {
	if (store.getState().auth.loggedIn) {
		return replace('/');
	}
}
