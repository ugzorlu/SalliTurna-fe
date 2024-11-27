import { SET_CITY } from '../actions/cityActions'

const initialCityState = {
    cityID: 82,
    cityName: 'Online',
}

export default function cityReducer(state = initialCityState, action) {
    const { type, city } = action

    switch (type) {
        case SET_CITY: {
            return {
                ...state,
                ...validatCity(city),
            }
        }
        default:
            return state
    }
}

function validatCity(city = {}) {
    return {
        cityID: city.cityID ?? 82,
        cityName: city.cityName ?? 'Online',
    }
}
