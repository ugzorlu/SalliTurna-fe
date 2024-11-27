export const SET_USER = 'SET_USER_CREDENTIALS'

export function setUser(user) {
    return { type: SET_USER, user }
}
