import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'

/* Constants and Helpers */
import { API_DIRECTORY } from '../utils/constants.js'
import { fetchWithErrorHandling } from '../utils/commons'
import { setDialog } from '../actions/dialogActions'

// Redux functions to connect Redux store begin.
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timeoutId: null,
        }
    }

    componentDidMount() {
        this.verifyEmail()
    }

    componentWillUnmount() {
        // Clears timeout to avoid memory leaks or unwanted redirects.
        const { timeoutId } = this.state
        if (timeoutId) clearTimeout(timeoutId)
    }

    verifyEmail = async () => {
        const { setDialog, match, history } = this.props
        const token = match?.params?.token

        if (!token) {
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: 'Geçersiz veya eksik doğrulama bağlantısı.',
            })
            return
        }

        try {
            const url = `${API_DIRECTORY}/verifyEmail/${token}`
            const responseVerifyEmail = await fetchWithErrorHandling(url, {
                method: 'GET',
                credentials: 'include',
            })
            if (responseVerifyEmail.status === 'success') {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseVerifyEmail.status,
                    message: responseVerifyEmail.message,
                })
                const timeoutId = setTimeout(() => history.push('/'), 2500)
                this.setState({ timeoutId })
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

    render() {
        return <div>E-posta doğrulanıyor...</div>
    }
}

// Connects component to Redux and exports it.
export default connect(null, mapDispatchToProps)(VerifyEmail)
