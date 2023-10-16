export default function reducer (state={
	page: null,
}, action){
	switch(action.type){
		case 'SET_PAGE': {
			return {
				...state,
				page: {...state, page: action.payload},
			}
		}
	}
	return state
}