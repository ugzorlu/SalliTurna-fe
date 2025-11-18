import { Component } from 'react'

/**
 * Checks if the user is authenticated. If not, it triggers a dialog warning.
 *
 * @param {Object} user - The user object containing authentication info.
 * @param {number} user.id - The ID of the user (0 if not authenticated).
 * @param {Function|null} setDialog - Function to open a dialog with status and message (optional)..
 * @returns {boolean} - Returns true if the user is authenticated, otherwise false.
 */
export const checkUserLoggedinStatus = (user, setDialog = null) => {
    // Ensures the user and dialog is valid.
    if (typeof user !== 'object' || user === null) {
        return false
    }
    if (typeof user.id !== 'number') {
        return false
    }
    if (setDialog && typeof setDialog !== 'function') {
        return false
    }

    // Checks if the user is not authenticated.
    // TODO Add progressive action to signup/login page.
    if (user.id === 0) {
        if (setDialog) {
            setDialog({
                isDialogActive: true,
                status: 'info',
                message: 'Bu işlemi gerçekleştirmek için giriş yapmalısınız.',
            })
        }
        return false
    }
    return true
}

/**
 * Checks if the user has admin privilege or not.
 *
 * @param {Object} user - The user object containing authentication info.
 * @param {number} user.id - The ID of the user (1 if admin).
 * @returns {boolean} - Returns true if the user has admin privilege, otherwise false.
 */
export const checkUserAdminStatus = (user) => {
    // Ensures the user is valid.
    if (typeof user !== 'object' || user === null) {
        return false
    }

    // Checks if the user does have admin privilege.
    if (user.id !== 1) {
        return false
    }
    return true
}

/**
 * Sets a cookie with the specified name, value, and expiration period.
 *
 * @param {string} cookieName - The name of the cookie.
 * @param {string} cookieValue - The value to store in the cookie.
 * @param {number} daysToExpire - The number of days until the cookie expires.
 */
export const setCookie = (cookieName, cookieValue, daysToExpire) => {
    // Ensures inputs are valid.
    if (typeof cookieName !== 'string' || !cookieName.trim()) {
        console.error('Çerez ismi doğrulanamadı.')
    }
    if (typeof cookieValue !== 'string') {
        console.error('Çerez içeriği doğrulanamadı.')
    }
    if (typeof daysToExpire !== 'number' || daysToExpire < 0) {
        console.error('Çerez güm sayısı doğrulanamadı.')
    }

    // Calculates expiration date in UTC string format.
    const date = new Date()
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000)

    // Sets cookie in document with necessary attributes.
    document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(
        cookieValue
    )}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
}

/**
 * Retrieves the value of the specified cookie.
 *
 * @param {string} cookieName - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value if found, otherwise null.
 */
export const getCookie = (cookieName) => {
    // Ensures input is valid.
    if (typeof cookieName !== 'string' || !cookieName.trim()) {
        console.error('Çerez ismi doğrulanamadı.')
    }

    // Constructs the search string for the cookie.
    const cookieNameString = `${encodeURIComponent(cookieName)}=`

    // Searchs for the specified cookie in the document's cookies.
    const cookies = document.cookie.split(';').map((item) => item.trim())
    for (const cookie of cookies) {
        if (cookie.startsWith(cookieNameString)) {
            // Returns the decoded cookie value if found.
            return decodeURIComponent(cookie.substring(cookieNameString.length))
        }
    }

    return null
}

/**
 * Retrieves the name of a city based on its ID.
 * If the city ID is not found, defaults to 'Tüm Türkiye'.
 *
 * @param {string} cityID - The ID of the city to retrieve.
 * @returns {string} The name of the city or 'Tüm Türkiye' if the ID is not found.
 */
export const getCityName = (cityID) => {
    // Ensures city ID is valid.
    if (typeof cityID !== 'string' || !cityID.trim()) {
        console.error("Şehir id'si doğrulanamadı.")
    }

    // List of cities with IDs and names.
    const cityArray = [
        { cityID: '0', cityName: 'Tüm Türkiye' },
        { cityID: '6', cityName: 'Ankara' },
        { cityID: '34', cityName: 'İstanbul' },
        { cityID: '35', cityName: 'İzmir' },
        { cityID: '82', cityName: 'Online' },
    ]

    // Searchs for the city by its ID.
    const city = cityArray.find((city) => city.cityID === cityID)

    // Returns the city name if found, otherwise return 'Tüm Türkiye'.
    return city ? city.cityName : 'Tüm Türkiye'
}

/**
 * Checks if the given file has a valid image type.
 *
 * @param {object} file - The file object to validate.
 * @param {string} file.type - The MIME type of the file (e.g., 'image/jpeg').
 * @returns {boolean} - Returns `true` if the file type is valid, otherwise `false`.
 */
export const validFileType = (file) => {
    // Ensuring the input is an object and has a valid 'type' property.
    if (!file || typeof file.type !== 'string') return false

    const validTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/webp']
    return validTypes.includes(file.type)
}

/**
 * Converts a file size (in bytes) into a human-readable format.
 *
 * @param {number} number - The file size in bytes.
 * @returns {string} - The formatted file size (e.g. '10.5 KB', '2.3 MB').
 * If the input is invalid or negative, it returns a custom error message.
 */
export const getReadableFileSize = (number) => {
    // Ensures the input is a valid positive number.
    if (typeof number !== 'number' || number < 0) return 'Dosya bulunamadı'

    if (number < 1024) return `${number} byte`
    if (number < 1048576) return `${(number / 1024).toFixed(1)} KB`
    return `${(number / 1048576).toFixed(1)} MB`
}

/**
 * Safely updates the nested objects in state for class components.
 * Facilitates spread operator in a nested state object.
 *
 * @param {React.Component} component - The class component instance.
 * @param {string} key - The state property to update.
 * @param {object} newState - The new state to merge with the existing state.
 */
export function updateState(component, key, newState) {
    // Ensures component and key are valid.
    if (!component || !component.setState) {
        return
    }
    if (!(key in component.state)) {
        return
    }

    // Merges with previous state by using a shallow copy.
    component.setState((prevState) => ({
        [key]: {
            ...prevState[key],
            ...newState,
        },
    }))
}

/**
 * Scrolls smoothly to the top of the given element if it exists.
 * If no element is provided, it will attempt to scroll the window to the top.
 *
 * @param {React.RefObject<HTMLElement>} ref - The React ref pointing to the element to scroll into view.
 * @param {ScrollBehavior} behavior - Optional scroll behavior: 'auto' or 'smooth'. Default is 'smooth'.
 */
export function scrollToTop(ref, behavior = 'smooth') {
    // Ensures 'ref' is a valid React ref object with a 'current' property.
    if (!ref || typeof ref !== 'object' || !('current' in ref)) {
        return
    }

    // Scrolls to the element if it exists; otherwise, scrolls the window to the top.
    const element = ref.current
    if (element) {
        try {
            element.scrollIntoView({ top: 400, behavior: behavior })
        } catch (error) {
            console.error('Kaydırma başarısız.', error)
        }
    } else {
        window.scrollTo({ top: 0, behavior })
    }
}

/**
 * Performs a fetch request and handles fetch-specific low-level errors.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {object} [options={}] - Optional fetch options such as headers, method, body, etc.
 * @returns {Promise<any>} Resolves with JSON response or rejects with an Error.
 * @throws {TypeError} Throws an type error if url or its options are not valid.
 * @throws {Error} Throws an error if the fetch fails or the response is not ok.
 */
export async function fetchWithErrorHandling(url, options = {}) {
    // Throws custom errors if any type check fails.
    if (typeof url !== 'string' || !url) {
        throw new TypeError('Lütfen geçerli bir URL girin.')
    }
    if (typeof options !== 'object') {
        throw new TypeError('Lütfen geçerli seçenekleri girin.')
    }

    try {
        const response = await fetch(url, options)

        if (!response.ok) {
            // Throws to signal the error explicitly.
            const errorMessage =
                `Bağlantı kurulamadı: ${response.status} ${response.statusText}.` +
                ` Lütfen daha sonra tekrar deneyin.`
            throw new Error(errorMessage)
        }

        return await response.json() // Return the parsed JSON response.
    } catch (error) {
        throw new Error(
            // Re-throws with a user-friendly message.
            'Bağlantı ya da sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        )
    }
}

/**
 * Safely adds a given object of key-value pairs to the state of a class component.
 *
 * @param {React.Component} component - The instance of the class component.
 * @param {object} newObject - An object containing key-value pairs to be added to the state.
 * @throws Will throw an error if `newObject` is not an object or if `component` is not a valid React component.
 */
export const addToState = (component, newObject) => {
    // Checks if the parameters are valid.
    if (!(component instanceof Component)) {
        console.error('Komponent doğrulanamadı.')
        throw new Error(
            'Beklenmedik bir hatayla karşılaşıldı. Lütfen tekrar deneyin veya bildirmek için bize ulaşın.'
        )
    }
    if (typeof newObject !== 'object' || newObject === null) {
        console.error('Yeni obje doğrulanamadı.')
        throw new Error(
            'Beklenmedik bir hatayla karşılaşıldı. Lütfen tekrar deneyin veya bildirmek için bize ulaşın.'
        )
    }

    // Updates the state while preserving existing state.
    component.setState((prevState) => ({
        ...prevState,
        ...newObject,
    }))
}

/**
 * Combines base CSS classes and optional conditional CSS classes into a single class string.
 *
 * @param {string} baseClasses - A string of one or more base CSS class names.
 * @param {string} [conditionalClass] - A CSS class name that will be added if the condition is truthy.
 * @param {boolean} [condition] - A condition that determines if the conditional class is added.
 * @returns {string} - A single string with all valid class names, separated by spaces.
 */
export function combineClassnames(
    baseClasses,
    conditionalClass = '',
    condition = false
) {
    // Checks if classes and the condition are valid and returns an empty class name if invalid.
    if (
        typeof baseClasses !== 'string' ||
        (conditionalClass && typeof conditionalClass !== 'string') ||
        typeof condition !== 'boolean'
    ) {
        return ''
    }

    // Removes any falsy/empty value and combine class names seperated by a single space.
    return [baseClasses, condition && conditionalClass]
        .filter(Boolean)
        .join(' ')
}

/**
 * Binds multiple events to a document with the provided handler and options.
 *
 * @param {Array<string>} events - List of event names to bind.
 * @param {Function} handler - Event handler function to execute.
 * @param {Object} [options={}] - Optional event listener options.
 */
export function bindDocumentEvents(events, handler, options = {}) {
    if (!Array.isArray(events) || typeof handler !== 'function') {
        return
    }

    events.forEach((event) => {
        document.addEventListener(event, handler, options)
    })
}

/**
 * Unbinds multiple events from a document with the provided handler and options.
 *
 * @param {Array<string>} events - List of event names to unbind.
 * @param {Function} handler - Event handler function to execute.
 * @param {Object} [options={}] - Optional event listener options.
 */
export function unbindDocumentEvents(events, handler, options = {}) {
    if (!Array.isArray(events) || typeof handler !== 'function') {
        return
    }

    events.forEach((event) => {
        document.removeEventListener(event, handler, options)
    })
}

/**
 * Checks if the specified target element was clicked within a referenced element.
 *
 * @param {React.RefObject<HTMLElement>} ref - A React reference to the target element to check.
 * @param {EventTarget | null} target - The target of the click event.
 * @returns {boolean} True if the target element was clicked within the referenced element, otherwise false.
 */
export function checkElementClicked(ref, target) {
    // Checks if the parameters are valid.
    if (!ref || typeof ref.current === 'undefined') {
        console.error('Geçerli bir React Ref objesi bulunamadı.')
    }
    if (target !== null && !(target instanceof EventTarget)) {
        console.error('Geçerli bir Event Target objesi bulunamadı.')
    }

    // Checks if the ref's current element contains the target element, returning false if ref.current is null.
    return ref?.current?.contains(target) || false
}

/**
 * Returns tooltip position based on a target element.
 *
 * @param {HTMLElement} target
 * @param {number} offset
 */
export function getTooltipPosition(target, offset = 8) {
    const rect = target.getBoundingClientRect()
    return {
        x: rect.left + rect.width / 2,
        y: rect.top - offset,
    }
}

/**
 *
 * Shows tooltip by setting visibility state and updating position.
 *
 *  @param {React.Component} component - The instance of the class component.
 *  @param {SyntheticEvent} event - Event object.
 *  @param {string} text - Current tooltip text.
 */
export function showTooltip(component, event, text) {
    const { x, y } = getTooltipPosition(event.target)

    component.setState((prevState) => ({
        ...prevState,
        tooltip: {
            ...prevState.tooltip,
            isVisible: true,
            x,
            y,
            text,
        },
    }))
}

/**
 *
 * Hides tooltip by setting visibility state.
 *
 *  @param {React.Component} component - The instance of the class component.
 */
export function hideTooltip(component) {
    component.setState((prevState) => ({
        ...prevState,
        tooltip: { ...prevState.tooltip, isVisible: false },
    }))
}
