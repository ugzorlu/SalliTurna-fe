import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'

/* Constants and Helpers */
import { API_DIRECTORY } from '../utils/constants'
import { fetchWithErrorHandling } from '../utils/commons'
import {
    SendFeedbackValidators,
    resetValidators,
    updateValidators,
    updateStateAndValidate,
    isFormValid,
} from '../utils/validators'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import '../styles/Contact.scss'

// Redux functions to connect Redux store begin.
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class Contact extends Component {
    constructor(props) {
        super(props)

        const title = this.props.location.search
            ? `${this.props.location.search.replace(
                  '?postid=',
                  ''
              )} numaralı gönderi hakkında şikayetim var`
            : ''

        this.state = {
            isSendFeedbackActive: true,
            email: '',
            title,
            feedback: '',
        }

        this.validators = SendFeedbackValidators
        resetValidators(this.validators)
        if (title) {
            updateValidators(this.validators, 'title', title)
        }
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

    handleSendFeedback = async (e) => {
        e.preventDefault()

        const { setDialog } = this.props
        const { email, title, feedback } = this.state

        if (isFormValid(this.validators)) {
            try {
                const url = `${API_DIRECTORY}/sendFeedback`
                const body = JSON.stringify({
                    sender_email: email.toLowerCase().trim(),
                    feedback_title: title,
                    feedback_text: feedback,
                })
                const responseSendFeedback = await fetchWithErrorHandling(url, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json; charset=UTF-8',
                    },
                    body,
                    credentials: 'include',
                })
                const { status, message } = responseSendFeedback
                // Displays custom success/error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status,
                    message,
                })
                this.props.history.push('/')
            } catch (error) {
                // Displays error messages from fetch helper function.
                setDialog({
                    isDialogActive: true,
                    status: 'error',
                    message: error.message,
                })
            }
        }
    }

    // Render helper functions begin.
    renderInputField = (
        type,
        name,
        placeholder,
        value,
        onChange,
        onInvalid
    ) => (
        <div className={`sendfeedback-${name}-wrapper`}>
            <input
                className={`sendfeedback-${name}`}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onInvalid={onInvalid}
                required
            />
            <label htmlFor={name}>{placeholder}</label>
        </div>
    )
    // Render helper functions end.

    render() {
        const { isSendFeedbackActive, email, title, feedback } = this.state

        return (
            <div className="sendfeedback-container">
                <form
                    className="sendfeedback-form"
                    onSubmit={this.handleSendFeedback}
                    style={{ display: isSendFeedbackActive ? 'flex' : 'none' }}
                >
                    <div className="sendfeedback-text">
                        Bize aşağıdaki formu doldurarak ulaşabilirsiniz.
                    </div>
                    {this.renderInputField(
                        'email',
                        'email',
                        'E-posta adresi',
                        email,
                        (e) => this.handleInputChange(e, 'email'),
                        (e) => this.handleInputChange(e, 'email')
                    )}
                    {this.renderInputField(
                        'text',
                        'title',
                        'Konu',
                        title,
                        (e) => this.handleInputChange(e, 'title'),
                        (e) => this.handleInputChange(e, 'title')
                    )}
                    <div className="sendfeedback-feedback-wrapper">
                        <textarea
                            className="sendfeedback-feedback"
                            rows="10"
                            name="feedback"
                            placeholder="Mesaj"
                            onChange={(e) =>
                                this.handleInputChange(e, 'feedback')
                            }
                            onInvalid={(e) =>
                                this.handleInputChange(e, 'feedback')
                            }
                            required
                        />
                        <label htmlFor="feedback">Mesaj</label>
                    </div>
                    <div className="sendfeedback-buttons-container">
                        <div className="sendfeedback-buttons-wrapper sendfeedback-buttons-wrapper-right">
                            <div className="sendfeedback-button-wrapper">
                                <input
                                    className="sendfeedback-button-send"
                                    type="submit"
                                    value="Gönder"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(null, mapDispatchToProps)(Contact)
