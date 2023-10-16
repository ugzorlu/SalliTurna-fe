import { SET_CITY } from '../actions/cityActions';

const initialCityState = {
	id: 82,
	name: 'Online',
};

export default function reducer(state = initialCityState, action) {
	switch (action.type) {
		case SET_CITY: {
			return {
				...state,
				id: action.city.id,
				name: action.city.name,
			};
		}
		default:
			return state;
	}
}
