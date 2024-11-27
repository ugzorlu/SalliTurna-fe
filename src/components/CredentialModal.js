import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

/* Internal Components */
import Spinner from './Spinner'

/* Constants and Helpers */
import { API_DIRECTORY } from '../utils/constants'
import {
    fetchWithErrorHandling,
    combineClassnames,
    bindDocumentEvents,
    unbindDocumentEvents,
} from '../utils/commons'
import {
    RegisterFormValidators,
    LoginFormValidators,
    resetValidators,
    updateValidators,
    isFormValid,
} from '../utils/validators'
import { setDialog } from '../actions/dialogActions'
import { setUser } from '../actions/userActions'

/* Styling */
import '../styles/CredentialModal.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        dialog: state.dialog,
    }
}
const mapDispatchToProps = {
    setUser,
    setDialog,
}
// Redux functions to connect Redux store end.

class RegisterMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputUser: {
                userName: '',
                userEmail: '',
                userPassword: '',
                userPasswordRepeat: '',
                isTermsAndConditionsAccepted: false,
            },
        }
        this.validators = RegisterFormValidators
        resetValidators(this.validators)
    }

    handleInputChange = (e, inputPropName, compareValue) => {
        // Ensures event, event's target and input are valid.
        if (
            !e?.target ||
            typeof inputPropName !== 'string' ||
            !inputPropName.trim()
        ) {
            return
        }
        // Gets the given text by descturing.
        const { type, value, checked } = e.target
        const inputValue = type === 'checkbox' ? checked : value

        // Updates state with the given value. Uses intermediate object to ensure merging correctly.
        const newState = { ...this.state }
        newState.inputUser[inputPropName] = inputValue
        this.setState(newState)

        // Updates validators with the given value.
        if (type === 'checkbox') {
            this.validators = updateValidators(
                this.validators,
                inputPropName,
                checked
            )
        } else {
            this.validators = updateValidators(
                this.validators,
                inputPropName,
                value,
                compareValue
            )
        }

        // Sets custom validity message if the input is invalid.
        const validator = this.validators[inputPropName]
        if (validator && !validator.valid) {
            e.target.setCustomValidity(
                validator.errors[0] || 'Geçersiz gönderi.'
            )
        } else {
            e.target.setCustomValidity('')
        }
    }

    handleFormSubmit = async (e) => {
        e.preventDefault()

        const { setDialog, setFormUploading } = this.props
        const { inputUser } = this.state

        try {
            // Shows user a loading animation.
            setFormUploading(true)

            if (isFormValid(this.validators)) {
                const url = `${API_DIRECTORY}/signUp`
                const body = JSON.stringify({
                    userName: inputUser.userName,
                    userEmail: inputUser.userEmail.toLowerCase().trim(),
                    userPassword: inputUser.userPassword,
                })
                // Signs up user with given credentials.
                const responseSignup = await fetchWithErrorHandling(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body,
                    credentials: 'include',
                })
                if (responseSignup.status === 'success') {
                    this.props.closeModal()
                }
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseSignup.status,
                    message: responseSignup.message,
                })
            } else {
                // Shows user custom user-friendly message for invalid form.
                setDialog({
                    isDialogActive: true,
                    status: 'error',
                    message:
                        'Hatalı alan. Lütfen girdiğiniz alanların doğruluğundan emin olup tekrar deneyin.',
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            // Removes the loading animation from the page.
            setFormUploading(false)
        }
    }

    // Render helper functions begin.
    renderInputField = (
        type,
        name,
        placeholder,
        value,
        label,
        compareValue = null
    ) => {
        return (
            <div className="credentials-modal-input">
                <input
                    type={type}
                    className={`register-${name.toLowerCase()}`}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onInvalid={(e) =>
                        this.handleInputChange(e, name, compareValue)
                    }
                    onChange={(e) =>
                        this.handleInputChange(e, name, compareValue)
                    }
                    required
                />
                <label htmlFor={name}>{label}</label>
            </div>
        )
    }

    renderCheckbox = (name, value) => {
        return (
            <div className="credentials-modal-input">
                <div className={`register-${name.toLowerCase()}-wrapper`}>
                    <input
                        type="checkbox"
                        className={`register-${name.toLowerCase()}`}
                        name={name}
                        checked={value}
                        onInvalid={(e) => this.handleInputChange(e, name)}
                        onChange={(e) => this.handleInputChange(e, name)}
                        required
                    />
                </div>
                <div
                    className={`register-${name.toLowerCase()}-checkbox-label`}
                >
                    <Link
                        to={{ pathname: '/info', hash: 'contract' }}
                        target="_blank"
                    >
                        Kullanıcı Sözleşmesi
                    </Link>
                    <span>ni ve&nbsp;</span>
                    <Link
                        to={{ pathname: '/info', hash: 'privacy' }}
                        target="_blank"
                    >
                        Gizlilik Politikası
                    </Link>
                    nı kabul ediyorum.
                </div>
            </div>
        )
    }

    renderSubmitButton = () => {
        return (
            <div className="credentials-modal-input">
                <input
                    type="submit"
                    className="credentials-modal-button"
                    value="Kayıt Ol"
                />
            </div>
        )
    }
    // Render helper functions end.

    render() {
        const { inputUser } = this.state

        return (
            <form
                className="credentials-register-form"
                onSubmit={this.handleFormSubmit}
            >
                {this.renderInputField(
                    'text',
                    'userName',
                    'Kullanıcı adı',
                    inputUser.userName,
                    'Kullanıcı adı'
                )}
                {this.renderInputField(
                    'email',
                    'userEmail',
                    'E-posta adresi',
                    inputUser.userEmail,
                    'E-posta adresi'
                )}
                {this.renderInputField(
                    'password',
                    'userPassword',
                    'Şifre',
                    inputUser.userPassword,
                    'Şifre'
                )}
                {this.renderInputField(
                    'password',
                    'userPasswordRepeat',
                    'Şifre (Tekrar)',
                    inputUser.userPasswordRepeat,
                    'Şifre (Tekrar)',
                    inputUser.userPassword
                )}
                {this.renderCheckbox(
                    'isTermsAndConditionsAccepted',
                    inputUser.isTermsAndConditionsAccepted
                )}
                {/* <div className='credentials-modal-input'>
					<div
						className='g-recaptcha credentials-modal-recaptcha'
					/>
				</div> */}
                {this.renderSubmitButton()}
            </form>
        )
    }
}
const ConnectedRegisterMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterMenu)
const RoutedConnectedConnectedRegisterMenu = withRouter(ConnectedRegisterMenu)

class LoginMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputUser: {
                userNameOrEmail: '',
                userPassword: '',
            },
        }

        this.validators = LoginFormValidators
        resetValidators(this.validators)
    }

    handleInputChange = (e, inputPropName) => {
        // Ensures event, event's target and input are valid.
        if (
            !e?.target ||
            typeof inputPropName !== 'string' ||
            !inputPropName.trim()
        ) {
            return
        }
        // Gets the given text by descturing.
        const { value } = e.target

        // Updates state with the given value. Uses intermediate object to ensure merging correctly.
        const newState = { ...this.state }
        newState.inputUser[inputPropName] = value
        this.setState(newState)

        // Updates validators with the given value.
        this.validators = updateValidators(
            this.validators,
            inputPropName,
            value
        )
        // Sets custom validity message if the input is invalid.
        const validator = this.validators[inputPropName]
        if (validator && !validator.valid) {
            e.target.setCustomValidity(
                validator.errors[0] || 'Geçersiz gönderi.'
            )
        } else {
            e.target.setCustomValidity('')
        }
    }

    handleFormSubmit = async (e) => {
        e.preventDefault()

        const { setDialog, setFormUploading } = this.props
        const { inputUser } = this.state

        try {
            // Shows user a loading animation.
            setFormUploading(true)

            if (isFormValid(this.validators)) {
                const body = JSON.stringify({
                    userNameOrEmail: inputUser.userNameOrEmail
                        .toLowerCase()
                        .trim(),
                    userPassword: inputUser.userPassword,
                })
                // Logs in user with given credentials.
                const responseLogin = await fetchWithErrorHandling(
                    `${API_DIRECTORY}/logIn`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                        },
                        body,
                        credentials: 'include',
                    }
                )
                if (responseLogin.status === 'success') {
                    // Sets found user information to the Redux state.
                    var returnUser = {
                        id: responseLogin.user.user_id,
                        username: responseLogin.user.user_name,
                    }
                    this.props.setUser(returnUser)
                    this.setState({
                        inputUser: {
                            userNameOrEmail: '',
                            userPassword: '',
                        },
                    })
                    this.props.closeModal()
                } else {
                    // Displays custom error/warning message from server response.
                    setDialog({
                        isDialogActive: true,
                        status: responseLogin.status,
                        message: responseLogin.message,
                    })
                }
            } else {
                // Shows user custom user-friendly message for invalid form.
                setDialog({
                    isDialogActive: true,
                    status: 'error',
                    message:
                        'Hatalı alan. Lütfen girdiğiniz alanların doğruluğundan emin olup tekrar deneyin.',
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            // Removes the loading animation from the page.
            setFormUploading(false)
        }
    }

    handleResetPassword = () => {
        const { closeModal, history } = this.props

        closeModal()
        history.push({ pathname: '/resetpassword' })
    }

    // Render helper functions begin.
    renderInputField = (type, name, placeholder, value, label) => {
        return (
            <div className="credentials-modal-input">
                <input
                    type={type}
                    className={`login-${name.toLowerCase()}`}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onInvalid={(e) => this.handleInputChange(e, name)}
                    onChange={(e) => this.handleInputChange(e, name)}
                    required
                />
                <label htmlFor={name}>{label}</label>
            </div>
        )
    }

    renderSubmitButton = () => {
        return (
            <div className="credentials-modal-input">
                <input
                    type="submit"
                    className="credentials-modal-button"
                    value="Giriş Yap"
                />
            </div>
        )
    }

    renderForgotPassword = () => {
        return (
            <div className="credentials-modal-input credentials-modal-input-login-forgotpassword">
                <div
                    className="login-forgotpassword-container"
                    onClick={this.handleResetPassword}
                >
                    Şifremi unuttum
                </div>
            </div>
        )
    }
    // Render helper functions end.

    render() {
        const { inputUser } = this.state

        return (
            <form
                className="credentials-login-form"
                onSubmit={this.handleFormSubmit}
            >
                {this.renderInputField(
                    'text',
                    'userNameOrEmail',
                    'Kullanıcı adı',
                    inputUser.userNameOrEmail,
                    'Kullanıcı adı'
                )}
                {this.renderInputField(
                    'password',
                    'userPassword',
                    'Şifre',
                    inputUser.userPassword,
                    'Şifre'
                )}
                {this.renderSubmitButton()}
                {this.renderForgotPassword()}
            </form>
        )
    }
}
const ConnectedLoginMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginMenu)
const RoutedConnectedLoginMenu = withRouter(ConnectedLoginMenu)

class CredentialModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFormUploading: false,
        }
        this.modalCredentialRef = createRef()
    }

    componentDidMount() {
        // Binds click events to the document. Optimized for mobile devices.
        // Prevents trigger first time clicks via capture option.
        bindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideCredentialModal,
            { capture: true }
        )
    }

    componentWillUnmount() {
        // Unbinds click events from the document. Optimized for mobile devices.
        unbindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideCredentialModal,
            { capture: true }
        )
    }

    handleClickOutsideCredentialModal = (e) => {
        // Hides credential modal from the view according to click area.
        const { isDialogActive } = this.props.dialog
        const modalCredential = this.modalCredentialRef.current
        if (
            !isDialogActive &&
            modalCredential &&
            !modalCredential.contains(e.target)
        ) {
            this.props.closeModal()
        }
    }

    setFormUploading = (isActive) => {
        this.setState({ isFormUploading: isActive })
    }

    // Render helper functions begin.
    renderSpinner = () => {
        const { isFormUploading } = this.state
        if (!isFormUploading) return null

        return <Spinner />
    }

    renderNavigation = () => {
        const {
            isRegisterMenuSelected,
            isLoginMenuSelected,
            closeModal,
            toggleModalMenu,
        } = this.props

        const credentialsModalRegisterMenuTitleClasses = combineClassnames(
            'credentials-modal-menutitle',
            'credentials-modal-menutitle-active',
            isRegisterMenuSelected
        )
        const credentialsModalLoginMenuTitleClasses = combineClassnames(
            'credentials-modal-menutitle',
            'credentials-modal-menutitle-active',
            isLoginMenuSelected
        )
        return (
            <>
                <span
                    className="credentials-modal-close"
                    onClick={closeModal}
                ></span>
                <ul className="credentials-modal-nav">
                    <li
                        className={credentialsModalRegisterMenuTitleClasses}
                        onClick={() => toggleModalMenu('register')}
                    >
                        KAYIT
                    </li>
                    <li
                        className={credentialsModalLoginMenuTitleClasses}
                        onClick={() => toggleModalMenu('login')}
                    >
                        GİRİŞ
                    </li>
                </ul>
            </>
        )
    }

    renderRegister = () => {
        const { isRegisterMenuSelected, closeModal } = this.props

        if (!isRegisterMenuSelected) {
            return null
        }
        return (
            <div className="credentials-register-container">
                <RoutedConnectedConnectedRegisterMenu
                    setFormUploading={this.setFormUploading}
                    closeModal={closeModal}
                />
            </div>
        )
    }

    renderLogin = () => {
        const { isLoginMenuSelected, closeModal } = this.props

        if (!isLoginMenuSelected) {
            return null
        }
        return (
            <div className="credentials-login-container">
                <RoutedConnectedLoginMenu
                    setFormUploading={this.setFormUploading}
                    closeModal={closeModal}
                />
            </div>
        )
    }
    // Render helper functions end.

    render() {
        return (
            <div className="credentials-modal-container">
                <div
                    className="credentials-modal"
                    ref={this.modalCredentialRef}
                >
                    {this.renderSpinner()}
                    {this.renderNavigation()}
                    {this.renderRegister()}
                    {this.renderLogin()}
                </div>
            </div>
        )
    }
}

// Connects component to Redux.
const ConnectedCredentialModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(CredentialModal)

// Exports component with React Router.
export default ConnectedCredentialModal
