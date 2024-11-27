import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

/* Constants and Helpers */
import { setCookie } from '../utils/commons.js'
import { setUser } from '../actions/userActions'

/* Styling */
import '../styles/Cookie.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}
const mapDispatchToProps = {
    setUser,
}
// Redux functions to connect Redux store end.

class Cookie extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isCookieBannerActive: true,
        }
    }

    componentDidMount() {
        this.setCookieBanner()
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.setCookieBanner()
        }
    }

    setCookieBanner = () => {
        const { isCookieAccepted } = this.props.user
        if (isCookieAccepted) {
            this.setState({ isCookieBannerActive: false })
        }
    }

    handleClickAccept = () => {
        const { user, setUser } = this.props
        let newUser = user
        newUser['isCookieAccepted'] = true
        setUser(newUser)
        setCookie('cookie', true, 365)
        this.setState({ isCookieBannerActive: false })
    }

    handleClickReject = () => {
        this.setState({ isCookieBannerActive: false })
    }

    render() {
        const { isCookieBannerActive } = this.state
        return (
            <div
                className="cookiebanner-container"
                style={{
                    display: isCookieBannerActive ? 'block' : 'none',
                }}
            >
                <div className="cookiebanner-wrapper">
                    <div className="cookie-text-wrapper">
                        <div className="cookie-text">
                            Size daha iyi hizmet sunabilmek için çerezler
                            yoluyla kişisel verilerinizi işliyoruz. Çerez
                            kullanımımıza ilişkin detaylı bilgi için{' '}
                            <Link
                                className="cookie-link"
                                to={{ pathname: '/info', hash: 'privacy' }}
                            >
                                tıklayın.
                            </Link>
                        </div>
                    </div>
                    <div className="cookie-buttons-container">
                        <div className="cookie-button-wrapper">
                            <div
                                className="cookie-button cookie-button-reject"
                                onClick={this.handleClickReject}
                            >
                                Tümünü Reddet
                            </div>
                        </div>
                        <div className="cookie-button-wrapper">
                            <div
                                className="cookie-button cookie-button-accept"
                                onClick={this.handleClickAccept}
                            >
                                Tümünü Kabul Et
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cookie-closebutton-wrapper">
                    <div
                        className="cookie-closebutton"
                        onClick={this.handleClickReject}
                    ></div>
                </div>
            </div>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(Cookie)
