import { SET_USER } from '../actions/userActions'

const initialUserState = {
    id: 0,
    username: null,
    unreadmessagecount: 0,
    isCookieAccepted: false,
}

export default function userReducer(state = initialUserState, action) {
    const { type, user } = action

    switch (type) {
        case SET_USER: {
            return {
                ...state,
                ...validateUser(user),
            }
        }
        default:
            return state
    }
}

function validateUser(user = {}) {
    return {
        id: user.id ?? 0,
        username: user.username ?? null,
        unreadmessagecount: user.unreadmessagecount ?? 0,
        isCookieAccepted: user.isCookieAccepted ?? false,
    }
}
