import {
    SET_PAGE,
    SET_LEFTFRAME,
    SET_TOPBAR,
    SET_SEARCH,
} from '../actions/navigationActions'

const initialNavigationState = {
    page: {},
    leftframe: {
        isMobileActive: false,
        menu: {
            isEventSelected: true,
            isTopicSelected: false,
        },
    },
    topbar: {
        isModalActive: false,
        menu: {
            isRegisterMenuSelected: false,
            isLoginMenuSelected: false,
        },
    },
    search: {
        isSearchActive: false,
        keyword: '',
    },
}

export default function navigationReducer(
    state = initialNavigationState,
    action
) {
    const {
        type,
        currentPage,
        currentLeftframe,
        currentTopbar,
        currentSearch,
    } = action

    switch (type) {
        case SET_PAGE: {
            return {
                ...state,
                page: {
                    ...validatePage(currentPage),
                },
            }
        }
        case SET_LEFTFRAME: {
            return {
                ...state,
                leftframe: {
                    ...validateLeftframe(currentLeftframe),
                },
            }
        }
        case SET_TOPBAR: {
            return {
                ...state,
                topbar: {
                    ...validateTopbar(currentTopbar),
                },
            }
        }
        case SET_SEARCH: {
            return {
                ...state,
                search: {
                    ...validateSearch(currentSearch),
                },
            }
        }
        default:
            return state
    }
}

function validateLeftframe(leftframe = {}) {
    return {
        isMobileActive: leftframe.isMobileActive ?? false,
        menu: {
            isEventSelected: leftframe.menu.isEventSelected ?? true,
            isTopicSelected: leftframe.menu.isTopicSelected ?? false,
        },
    }
}

function validateTopbar(topbar = {}) {
    return {
        isModalActive: topbar.isModalActive ?? false,
        menu: {
            isRegisterMenuSelected: topbar.menu.isRegisterMenuSelected ?? false,
            isLoginMenuSelected: topbar.menu.isLoginMenuSelected ?? false,
        },
    }
}

function validateSearch(search = {}) {
    return {
        isSearchActive: search.isSearchActive ?? false,
        keyword: search.keyword ?? '',
    }
}
