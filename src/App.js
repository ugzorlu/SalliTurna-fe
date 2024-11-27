import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

/* Internal Components */
import TopBar from './components/TopBar'
import LeftFrame from './components/LeftFrame'
import Main from './components/Main'
import Footer from './components/Footer'
import Dialog from './components/Dialog'
import Cookie from './components/Cookie'
import PhotoModal from './components/PhotoModal'

/* Constants and Helpers */
import { API_DIRECTORY, GOOGLETAGMANAGER_ID } from './utils/constants'
import { fetchWithErrorHandling, getCookie } from './utils/commons'
import { setUser } from './actions/userActions'
import { setDialog } from './actions/dialogActions'

/* Styling */
import './styles/App.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        User: state.user,
        dialog: state.dialog,
        modal: state.modal,
    }
}
const mapDispatchToProps = {
    setUser,
    setDialog,
}
// Redux functions to connect Redux store end.

class App extends Component {
    constructor(props) {
        super(props)
        this.checkUserLogIn()
    }

    checkUserLogIn = async () => {
        const { setDialog } = this.props
        try {
            // Gets user from db.
            const url = `${API_DIRECTORY}/getUser`

            const responseUser = await fetchWithErrorHandling(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })

            // Sets a default dummy user.
            const defaultUser = {
                id: 0,
                username: '',
                unreadmessagecount: 0,
                isCookieAccepted: false,
            }
            let currentUser = defaultUser

            // Checks if there is a user in those credentials and sets it accordingly.
            const userProfile = responseUser?.userProfile
            if (userProfile && typeof userProfile === 'object') {
                currentUser = {
                    id: this.validateUserId(userProfile.user_id),
                    username: this.validateUsername(userProfile.user_name),
                }

                // Checks if there is a message unread and sets it accordingly.
                if (
                    Array.isArray(userProfile.receiver) &&
                    userProfile.receiver.length
                ) {
                    const unreadCount = this.validateUnreadCount(
                        parseInt(userProfile.receiver[0].unread_count)
                    )
                    currentUser.unreadmessagecount = unreadCount
                }
            }
            // Sets cookie acception preference for the user whether it's logged in or not.
            const isCookieAccepted = getCookie('cookie')
            currentUser.isCookieAccepted = isCookieAccepted

            this.props.setUser(currentUser)
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }
    validateUserId(userId) {
        return typeof userId === 'number' && userId > 0 ? userId : 0
    }
    validateUsername(username) {
        return typeof username === 'string' && username.trim() ? username : ''
    }
    validateUnreadCount(count) {
        return typeof count === 'number' && count > 0 ? count : 0
    }

    // Render helper functions begin.
    setMetadata = () => {
        // Sets Google Tag Manager metadata for anaytics.

        const src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLETAGMANAGER_ID}`

        return (
            <Helmet>
                <script async defer fetchpriority="low" src={src}></script>
                <script>
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag() {
                            dataLayer.push(arguments);
                        }
                        gtag('js', new Date());
                        gtag('config', '${GOOGLETAGMANAGER_ID}');
                    `}
                </script>
            </Helmet>
        )
    }

    renderDialog = () => {
        const { isDialogActive } = this.props.dialog
        if (isDialogActive) {
            return <Dialog />
        }
        return null
    }

    renderPhotoModal = () => {
        const { isModalActive } = this.props.modal
        if (isModalActive) {
            return <PhotoModal />
        }
        return null
    }
    // Render helper functions end.

    render() {
        return (
            <>
                {this.setMetadata()}
                <div className="salliturna">
                    <TopBar />
                    <LeftFrame />
                    <Main />
                    <Cookie />
                    <Footer />
                    {this.renderDialog()}
                    {this.renderPhotoModal()}
                </div>
            </>
        )
    }
}

// Connects component to Redux.
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

// Exports component with React Router.
export default withRouter(ConnectedApp)
