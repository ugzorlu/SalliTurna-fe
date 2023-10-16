import { combineReducers } from 'redux'
// import * as reducers from './reducers'
// export default combineReducers(reducers)

import user from './userReducer'
import city from './cityReducer'
// import page from './pageReducer'

export default combineReducers({
	user,
	city
})
