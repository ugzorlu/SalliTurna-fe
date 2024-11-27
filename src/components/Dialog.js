import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'

/* Constants and Helpers */
import { setDialog } from '../actions/dialogActions'

/* Styling */
import '../styles/Dialog.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        dialog: state.dialog,
    }
}
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class Dialog extends Component {
    constructor(props) {
        super(props)
    }

    closeDialog = () => {
        const { setDialog } = this.props
        const defaultDialogState = {
            isDialogActive: false,
            status: null,
            message: null,
            action: null,
        }
        setDialog(defaultDialogState)
    }

    handleRightButtonClick = () => {
        const { dialog } = this.props

        // Hides current warnign dialog and progress through specified action.
        this.closeDialog()
        dialog.action()
    }

    render() {
        const { dialog } = this.props

        // Determines CSS classes for title bar based on dialog status.
        const titlebarClass = `dialog-titlebar ${
            dialog.status === 'error'
                ? 'dialog-error'
                : dialog.status === 'success'
                ? 'dialog-success'
                : dialog.status === 'warning'
                ? 'dialog-warning'
                : 'dialog-info'
        }`
        const titlebarText =
            {
                error: 'Hata',
                success: 'Başarılı',
                warning: 'Uyarı',
            }[dialog.status] || 'Bilgi'

        return (
            <div
                className="dialog-container"
                style={{
                    display: dialog.isDialogActive ? 'block' : 'none',
                }}
            >
                <div className="dialog">
                    <p className={titlebarClass}>{titlebarText}</p>
                    <div className="dialog-text">
                        <p className="dialog-message">{dialog.message}</p>
                        {dialog.status === 'warning' ? (
                            <>
                                <div
                                    className="dialog-leftbutton"
                                    onClick={this.closeDialog}
                                >
                                    Vazgeç
                                </div>
                                <div
                                    className="dialog-rightbutton"
                                    onClick={this.handleRightButtonClick}
                                >
                                    İlerle
                                </div>
                            </>
                        ) : (
                            <div
                                className="dialog-rightbutton"
                                onClick={this.closeDialog}
                            >
                                Tamam
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(Dialog)
