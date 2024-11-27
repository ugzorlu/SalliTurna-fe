import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'

/* Constants and Helpers */
import { API_DIRECTORY } from '../utils/constants'
import { fetchWithErrorHandling } from '../utils/commons'
import {
    SendPasswordTokenValidators,
    NewPasswordFormValidators,
    resetValidators,
    updateValidators,
    updateStateAndValidate,
    isFormValid,
} from '../utils/validators'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import '../styles/ResetPassword.scss'

// Redux functions to connect Redux store begin.
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class ResetPassword extends Component {
    constructor(props) {
        super(props)

        const isTokenPresent = this.props.location.search.includes('token=')
        const token = isTokenPresent
            ? this.props.location.search.replace('?token=', '')
            : ''

        this.state = {
            sendPassword: {
                isSendPasswordActive: !isTokenPresent,
                inputEmail: '',
            },
            resetPassword: {
                isResetPasswordActive: isTokenPresent,
                token: token,
                inputNewPassword: '',
            },
        }

        this.validators = isTokenPresent
            ? NewPasswordFormValidators
            : SendPasswordTokenValidators

        resetValidators(this.validators)
    }

    handleInputChange = (e, inputPropName, objectName = null) => {
        updateStateAndValidate(
            this,
            e,
            inputPropName,
            objectName,
            updateValidators
        )
    }

    handleSendPassword = async (e) => {
        e.preventDefault()

        const { setDialog } = this.props

        try {
            if (isFormValid(this.validators)) {
                const url = `${API_DIRECTORY}/sendPasswordToken`
                const body = JSON.stringify({
                    user_email: this.state.sendPassword.inputEmail
                        .toLowerCase()
                        .trim(),
                })

                const responseSendPasswordToken = await fetchWithErrorHandling(
                    url,
                    {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json; charset=UTF-8',
                        },
                        body,
                        credentials: 'include',
                    }
                )
                // Shows user custom return message according to all kinds of response.
                setDialog({
                    isDialogActive: true,
                    status: responseSendPasswordToken.status,
                    message: responseSendPasswordToken.message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }

    handleResetPassword = async (e) => {
        e.preventDefault()

        const { setDialog, history } = this.props

        try {
            const url = `${API_DIRECTORY}/resetPassword`
            const body = JSON.stringify({
                resetpassword_token: this.state.resetPassword.token,
                user_newpassword: this.state.resetPassword.inputNewPassword,
            })

            if (isFormValid(this.validators)) {
                const responseResetPassword = await fetchWithErrorHandling(
                    url,
                    {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json; charset=UTF-8',
                        },
                        body,
                        credentials: 'include',
                    }
                )
                history.push('/')
                // Shows user custom return message according to all kinds of response.
                setDialog({
                    isDialogActive: true,
                    status: responseResetPassword.status,
                    message: responseResetPassword.message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }

    // Render helper functions begin.
    renderForm = (prefix, inputs, submitButtonValue, onSubmitHandler) => (
        <form className={`${prefix}password-form`} onSubmit={onSubmitHandler}>
            {prefix === 'send' && (
                <div className={`${prefix}password-text`}>
                    Kayıt olduğunuz e-posta adresini girin. Adresinize şifre
                    yenileme linki göndereceğiz.
                </div>
            )}
            {inputs.map(
                (
                    { label, inputPropName, stateObject, ...inputProps },
                    index
                ) => (
                    <div
                        key={index}
                        className={`${prefix}password-${inputProps.name}-wrapper`}
                    >
                        <input
                            {...inputProps}
                            className={`${prefix}password-${inputProps.name}`}
                            onChange={(e) =>
                                this.handleInputChange(
                                    e,
                                    inputPropName,
                                    stateObject
                                )
                            }
                            required
                        />
                        <label htmlFor={inputProps.name}>{label}</label>
                    </div>
                )
            )}
            <div className={`${prefix}password-bottom`}>
                <div className={`${prefix}password-button-wrapper`}>
                    <input
                        type="submit"
                        className={`${prefix}password-button`}
                        value={submitButtonValue}
                    />
                </div>
            </div>
        </form>
    )
    // Render helper functions end.

    render() {
        const { isSendPasswordActive } = this.state.sendPassword
        const { isResetPasswordActive } = this.state.resetPassword

        const sendPasswordInputs = [
            {
                type: 'email',
                name: 'email',
                placeholder: 'E-posta adresi',
                label: 'E-posta adresi',
                inputPropName: 'inputEmail',
                stateObject: 'sendPassword',
            },
        ]
        const resetPasswordInputs = [
            {
                type: 'password',
                name: 'password',
                placeholder: 'Yeni şifre',
                label: 'Yeni şifre',
                inputPropName: 'inputNewPassword',
                stateObject: 'resetPassword',
            },
        ]

        return (
            <div className="password-container">
                <div className="password-wrapper">
                    {isSendPasswordActive &&
                        this.renderForm(
                            'send',
                            sendPasswordInputs,
                            'Gönder',
                            this.handleSendPassword
                        )}
                    {isResetPasswordActive &&
                        this.renderForm(
                            'reset',
                            resetPasswordInputs,
                            'Şifremi yenile',
                            this.handleResetPassword
                        )}
                </div>
            </div>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(null, mapDispatchToProps)(ResetPassword)
