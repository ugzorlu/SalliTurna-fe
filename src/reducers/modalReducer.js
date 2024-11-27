import { SET_MODAL } from '../actions/modalActions'

const initialModalState = {
    isModalActive: false,
    photoLink: '',
}

export default function modalReducer(state = initialModalState, action) {
    const { type, modal } = action

    switch (type) {
        case SET_MODAL: {
            return {
                ...state,
                ...validateModal(modal),
            }
        }
        default:
            return state
    }
}

function validateModal(modal = {}) {
    return {
        isModalActive: modal.isModalActive ?? false,
        photoLink: modal.photoLink ?? '',
    }
}
