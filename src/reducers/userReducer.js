import {
  SET_USER_CREDENTIALS
} from '../actions/userActions'

const initialUserState = {
	id: null,
	username: null
}

export default function reducer (state = initialUserState, action){
	switch(action.type){
		case SET_USER_CREDENTIALS: {
			return {
				...state,
				id: action.user.id,
				username: action.user.username
			}
		}
		default:
      return state
	}
}
