import { SET_DIALOG } from '../actions/dialogActions'

const initialDialogState = {
    isDialogActive: false,
    status: null,
    message: null,
    action: null,
}

export default function dialogReducer(state = initialDialogState, action) {
    const { type, dialog } = action

    switch (type) {
        case SET_DIALOG: {
            return {
                ...state,
                ...validateDialog(dialog),
            }
        }
        default:
            return state
    }
}

function validateDialog(dialog = {}) {
    return {
        isDialogActive: dialog.isDialogActive ?? false,
        status: dialog.status ?? '',
        message: dialog.message ?? '',
        action: dialog.action ?? '',
    }
}
