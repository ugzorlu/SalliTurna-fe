import React, { Component } from 'react';
import classNames from 'classnames';

import '../styles/App.scss';
import '../styles/Dialog.scss';

class Dialog extends Component {
	constructor(props) {
		super(props);
	}

	handleRightButtonClick = () => {
		if (this.props.dialog.action) {
			this.props.dialog.action();
		}
		this.props.closeDialog();
	};

	render() {
		let titlebarClasses = classNames(
			'dialog-titlebar',
			{ 'dialog-error': this.props.dialog.status === 'error' },
			{ 'dialog-success': this.props.dialog.status === 'success' },
			{ 'dialog-warning': this.props.dialog.status === 'warning' },
			{
				'dialog-info':
					this.props.dialog.status === false ||
					this.props.dialog.status === 'info',
			}
		);
		let titlebarTexts = '';
		if (this.props.dialog.status === 'error') {
			titlebarTexts = 'Hata';
		} else if (this.props.dialog.status === 'success') {
			titlebarTexts = 'Başarılı';
		} else if (this.props.dialog.status === 'warning') {
			titlebarTexts = 'Uyarı';
		} else {
			titlebarTexts = 'Bilgi';
		}

		return (
			<div
				id='dialog-container'
				className='dialog-container'
				style={{ display: this.props.dialog.isDialogHidden ? 'none' : 'block' }}
			>
				<div className='dialog'>
					<p className={titlebarClasses}>{titlebarTexts}</p>
					<div className='dialog-text'>
						<p className='dialog-message'>{this.props.dialog.message}</p>
						<div
							id='dialog-leftbutton'
							className='dialog-leftbutton'
							onClick={this.props.closeDialog}
							style={{
								display:
									this.props.dialog.status === 'warning' ? 'block' : 'none',
							}}
						>
							Vazgeç
						</div>
						{/*<input id="dialog-leftbutton" type="button" className="dialog-leftbutton" value="Vazgeç" onClick={this.props.closeDialog} style={{display: this.props.dialog.status==="warning" ? 'block' : 'none'}}/>*/}
						<div
							id='dialog-rightbutton'
							className='dialog-rightbutton'
							onClick={this.handleRightButtonClick}
						>
							Tamam
						</div>
						{/* <input id="dialog-rightbutton" type="button" className="dialog-rightbutton" value="Tamam" onClick={this.handleRightButtonClick}/>*/}
					</div>
				</div>
			</div>
		);
	}
}

export default Dialog;
