import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'

/* Internal Components */
import Home from './Home.js'

/* Constants and Helpers */
import { setDialog } from '../actions/dialogActions'

// Redux functions to connect Redux store begin.
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class NotFound extends Component {
    componentDidMount() {
        const { setDialog } = this.props
        setDialog({
            isDialogActive: true,
            status: 'error',
            message: 'Üzgünüz! Aradığınız sayfa bulunamadı.',
        })
    }

    render() {
        return <Home />
    }
}

// Connects component to Redux and exports it.
export default connect(null, mapDispatchToProps)(NotFound)
