/**
 * Updates a nested or top-level state property and manages validation for form inputs.
 *
 * @param {React.Component} component - The class component instance using this helper.
 * @param {Event} e - The event object from the input.
 * @param {string} inputPropName - The name of the property to update in the state.
 * @param {string|null} objectName - The name of the nested object in the state to update (optional).
 * @param {Function} updateValidators - A function to update validation rules, if applicable.
 * @returns {void}
 */
export function updateStateAndValidate(
    component,
    e,
    inputPropName,
    objectName = null,
    updateValidators
) {
    // Ensures component, event, event's target and input are valid.
    if (
        !component ||
        !component.setState ||
        !e?.target ||
        typeof inputPropName !== 'string' ||
        !inputPropName.trim()
    ) {
        console.error('Invalid parameters provided to handleInputChangeHelper.')
        return
    }

    const { value } = e.target
    const { state, validators } = component

    // Prepare the new state to update either a nested or top-level property
    const newState = { ...state }

    if (objectName) {
        // Ensures the nested object exists in state.
        if (!state[inputPropName] || typeof state[inputPropName] !== 'object') {
            console.error(`Object not found in state: "${inputPropName}".`)
            return
        }

        // Updates the nested object property.
        newState[inputPropName] = {
            ...state[inputPropName],
            [objectName]: value,
        }
    } else {
        // Updates the top-level state property.
        newState[inputPropName] = value
    }

    // Updates the component's state.
    component.setState(newState)

    // Updates validators with the given value if validators and updateValidators are provided.
    if (validators && typeof updateValidators === 'function') {
        const validationProp = objectName ? objectName : inputPropName

        const updatedValidators = updateValidators(
            validators,
            validationProp,
            value
        )
        component.validators = updatedValidators

        // Set custom validity message if validation fails
        const validator = updatedValidators[validationProp]
        if (validator && !validator.valid) {
            e.target.setCustomValidity(
                validator.errors[0] || 'Geçersiz gönderi.'
            )
        } else {
            e.target.setCustomValidity('')
        }
    }
}

/**
 * Checks if all fields in the validators object are valid.
 *
 * @param {object} validators - An object containing validation rules for fields.
 * @returns {boolean} - True if all fields are valid, otherwise false.
 */
export const isFormValid = (validators) => {
    // Ensures validators are valid.
    if (typeof validators !== 'object' || validators === null) {
        return false
    }

    return Object.values(validators).every(
        (validator) => validator?.valid === true
    )
}

/**
 * Resets all validators to their initial state.
 *
 * @param {object} validators - An object containing validation rules for fields.
 */
export const resetValidators = (validators) => {
    // Ensures validators are valid.
    if (typeof validators !== 'object' || validators === null) {
        return
    }

    // Iterates validators to make each and every one default.
    Object.values(validators).forEach((validator) => {
        if (validator && typeof validator === 'object') {
            validator.errors = []
            validator.state = ''
            validator.valid = false
        }
    })
}

/**
 * Updates the validator state for a specific field.
 *
 * @param {object} validators - An object containing validation rules for fields.
 * @param {string} fieldName - The name of the field to validate.
 * @param {string} value - The current value of the field.
 * @param {any} [compareValue] - An optional value to compare against (if needed).
 * @returns {object} - The updated validators object.
 */
export const updateValidators = (
    validators,
    fieldName,
    value,
    compareValue
) => {
    // Ensures validators and selected validator are valid.
    if (
        typeof validators !== 'object' ||
        validators === null ||
        !validators[fieldName]
    ) {
        return
    }
    const validator = validators[fieldName]
    if (typeof validator !== 'object') {
        return
    }

    // Reset the field's state and errors before applying new validation.
    validator.errors = []
    validator.state = value
    validator.valid = true

    // Iterate over each rule and apply it to the field's value.
    validator.rules.forEach((rule) => {
        if (rule.test instanceof RegExp) {
            if (!rule.test.test(value)) {
                validator.errors.push(rule.message)
                validator.valid = false
            }
        } else if (typeof rule.test === 'function') {
            if (!rule.test(value, compareValue)) {
                validator.errors.push(rule.message)
                validator.valid = false
            }
        } else {
            return
        }
    })

    return validators
}

const RegisterFormValidators = {
    userName: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Kullanıcı adı boş bırakılamaz.',
            },
            {
                test: /^[A-Za-z0-9 _\u00E7\u011F\u0131\u015F\u00F6\u00FC\u00C7\u011E\u0130\u015E\u00D6\u00DC]+$/,
                message:
                    'Kullanıcı adı yalnızca harf, rakam, boşluk veya "_" karakterlerinden oluşabilir.',
            },
            {
                test: (value) => {
                    return value.length <= 20
                },
                message: 'Kullanıcı adı 20 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    userEmail: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'E-posta adresi boş bırakılamaz.',
            },
            {
                test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Lütfen geçerli bir e-posta adresi giriniz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    userPassword: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Şifre boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length >= 4
                },
                message: 'Şifre 4 karakterden az olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    userPasswordRepeat: {
        rules: [
            {
                test: (value, compareValue) => {
                    return value === compareValue
                },
                message: 'Şifrelerin eşleşmesi gerekmekte.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    isTermsAndConditionsAccepted: {
        rules: [
            {
                test: (value) => {
                    return value === true
                },
                message: 'Kullanıcı sözleşmesini onaylamalısınız.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const LoginFormValidators = {
    userNameOrEmail: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Kullanıcı adı ya da e-posta boş bırakılamaz.',
            },
            {
                test: /^[A-Za-z@\.0-9 _\u00E7\u011F\u0131\u015F\u00F6\u00FC\u00C7\u011E\u0130\u015E\u00D6\u00DC]+$/,
                message:
                    'Kullanıcı adı yalnızca harf, rakam, boşluk veya "_" karakterlerinden oluşabilir.',
            },
            {
                test: (value) => {
                    return value.length <= 50
                },
                message:
                    'Kullanıcı adı ya da e-posta 50 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    userPassword: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Şifre boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length >= 4
                },
                message: 'Şifre 4 karakterden az olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const SendPasswordTokenValidators = {
    inputEmail: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'E-posta adresi boş bırakılamaz.',
            },
            {
                test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Lütfen geçerli bir e-posta adresi giriniz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const NewPasswordFormValidators = {
    inputNewPassword: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Yeni şifre boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length >= 4
                },
                message: 'Yeni şifre 4 karakterden az olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const PostFormValidators = {
    inputText: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Gönderi boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length <= 10000
                },
                message: 'Gönderi 10000 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const TopicFormValidators = {
    categoryID: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Kategori seçmelisiniz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    inputText: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Gönderi boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length <= 10000
                },
                message: 'Gönderi 10000 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    inputTitle: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Başlık boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length <= 75
                },
                message: 'Başlık 75 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const SendFeedbackValidators = {
    email: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'E-posta adresi boş bırakılamaz.',
            },
            {
                test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Lütfen geçerli bir e-posta adresi giriniz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    title: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Konu boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length <= 500
                },
                message: 'Konu 500 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    feedback: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Mesaj boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length <= 10000
                },
                message: 'Mesaj 10000 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

const InboxValidators = {
    messageText: {
        rules: [
            {
                test: (value) => {
                    return value.length > 0
                },
                message: 'Mesaj boş bırakılamaz.',
            },
            {
                test: (value) => {
                    return value.length <= 10000
                },
                message: 'Mesaj 10000 karakterden fazla olamaz.',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
}

export {
    RegisterFormValidators,
    LoginFormValidators,
    SendPasswordTokenValidators,
    NewPasswordFormValidators,
    PostFormValidators,
    TopicFormValidators,
    SendFeedbackValidators,
    InboxValidators,
}
