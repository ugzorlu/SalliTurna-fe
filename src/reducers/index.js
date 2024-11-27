import { combineReducers } from 'redux'
// import * as reducers from './reducers'
// export default combineReducers(reducers)

import user from './userReducer'
import city from './cityReducer'
import dialog from './dialogReducer'
import modal from './modalReducer'
import navigation from './navigationReducer'

export default combineReducers({
    user,
    city,
    dialog,
    modal,
    navigation,
})
