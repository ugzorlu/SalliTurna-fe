export const SET_PAGE = 'SET_PAGE'
export const SET_LEFTFRAME = 'SET_LEFTFRAME'
export const SET_TOPBAR = 'SET_TOPBAR'
export const SET_SEARCH = 'SET_SEARCH'

export function setPage(currentPage) {
    return {
        type: SET_PAGE,
        currentPage,
    }
}

export function setLeftframe(currentLeftframe) {
    return {
        type: SET_LEFTFRAME,
        currentLeftframe,
    }
}

export function setTopbar(currentTopbar) {
    return {
        type: SET_TOPBAR,
        currentTopbar,
    }
}

export function setSearch(currentSearch) {
    return {
        type: SET_SEARCH,
        currentSearch,
    }
}
