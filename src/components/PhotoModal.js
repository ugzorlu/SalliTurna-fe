import React, { Component } from 'react';
import { Image } from 'cloudinary-react';

import '../styles/PhotoModal.scss';

class PhotoModal extends Component {
	constructor(props) {
		super(props);
	}

	handleCloseModal = () => {
		this.props.updateModal(true, null);
	};

	render() {
		return (
			<div
				className='modal-container'
				id='modal-photo-container'
				style={{ display: this.props.modal.isModalHidden ? 'none' : 'block' }}
			>
				<div className='modal' id='modal-photo'>
					<span className='modal-close' onClick={this.handleCloseModal}></span>
					<div className='modal-photo-wrapper'>
						<Image
							cloudName='di6klblik'
							publicId={this.props.modal.photoLink}
							width='100%'
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default PhotoModal;
