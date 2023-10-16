import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import '../styles/Footer.scss';

class Footer extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className='footer-container'>
				<div className='footer-group-container'>
					<div className='footer-group'>
						<a
							href='https://www.instagram.com/salliturna/'
							target='_blank'
							rel='noreferrer'
						>
							<div className='footer-group-socialmedia'>
								<div className='footer-socialmedia-icon footer-socialmedia-icon-insta'></div>
								<div className='footer-socialmedia-text'>/salliturna</div>
							</div>
						</a>
					</div>
					<div className='footer-group'>
						<Link to={{ pathname: '/contact' }}>
							<span className='footer-item footer-contact'>İletişim</span>
						</Link>
						<Link to={{ pathname: '/info', hash: 'faq' }}>
							<span className='footer-item footer-faq'>
								Sıkça Sorulan Sorular
							</span>
						</Link>
						<Link to={{ pathname: '/info', hash: 'contract' }}>
							<span className='footer-item footer-contract'>
								Kullanıcı Sözleşmesi
							</span>
						</Link>
						<Link to={{ pathname: '/info', hash: 'privacy' }}>
							<span className='footer-item footer-privacy'>
								Gizlilik Politikası
							</span>
						</Link>
					</div>
					<div className='footer-group'>
						<a
							href='https://www.twitter.com/salliturna/'
							target='_blank'
							rel='noreferrer'
						>
							<div className='footer-group-socialmedia'>
								<div className='footer-socialmedia-icon footer-socialmedia-icon-twitter'></div>
								<div className='footer-socialmedia-text'>/salliturna</div>
							</div>
						</a>
					</div>
				</div>
				<div className='footer-owner'>
					Bu site{' '}
					<a
						className='footer-owner-link'
						href='https://www.linkedin.com/in/ugzorlu/'
						target='_blank'
						rel='noreferrer'
					>
						Umut Gencay ZORLU
					</a>{' '}
					tarafından hazırlanmıştır.
				</div>
			</div>
		);
	}
}

export default Footer;
