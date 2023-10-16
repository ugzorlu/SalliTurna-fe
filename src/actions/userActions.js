export const SET_USER_CREDENTIALS = 'SET_USER_CREDENTIALS';

export function setUserCredentials(user) {
	return { type: SET_USER_CREDENTIALS, user };
}
//TODO async
