import React, { Component } from 'react'

/* External Libraries */
import { Link } from 'react-router-dom'

/* Styling */
import '../styles/Footer.scss'

class Footer extends Component {
    // Render helper functions begin.
    renderSocialMediaLink = (platform, link, username) => (
        <a href={link} target="_blank" rel="noreferrer">
            <div className="footer-group-socialmedia">
                <div
                    className={`footer-socialmedia-icon footer-socialmedia-icon-${platform}`}
                ></div>
                <div className="footer-socialmedia-text">/{username}</div>
            </div>
        </a>
    )

    renderMenuItemLink = (to, label) => (
        <Link to={to}>
            <span className={`footer-item footer-${label.toLowerCase()}`}>
                {label}
            </span>
        </Link>
    )
    // Render helper functions end.

    render() {
        return (
            <div className="footer-container">
                <div className="footer-group-container">
                    <div className="footer-group">
                        {this.renderSocialMediaLink(
                            'insta',
                            'https://www.instagram.com/salliturna/',
                            'salliturna'
                        )}
                    </div>
                    <div className="footer-group">
                        {this.renderMenuItemLink(
                            { pathname: '/contact' },
                            'İletişim'
                        )}
                        {this.renderMenuItemLink(
                            { pathname: '/info', hash: 'faq' },
                            'Sıkça Sorulan Sorular'
                        )}
                        {this.renderMenuItemLink(
                            { pathname: '/info', hash: 'contract' },
                            'Kullanıcı Sözleşmesi'
                        )}
                        {this.renderMenuItemLink(
                            { pathname: '/info', hash: 'privacy' },
                            'Gizlilik ve Çerez Politikası'
                        )}
                    </div>
                    <div className="footer-group">
                        {this.renderSocialMediaLink(
                            'twitter',
                            'https://www.x.com/salliturna',
                            'salliturna'
                        )}
                    </div>
                </div>
                <div className="footer-owner">
                    Bu site{' '}
                    <a
                        className="footer-owner-link"
                        href="https://www.linkedin.com/in/ugzorlu/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Umut Gencay ZORLU
                    </a>{' '}
                    tarafından hazırlanmıştır.
                </div>
            </div>
        )
    }
}

export default Footer
