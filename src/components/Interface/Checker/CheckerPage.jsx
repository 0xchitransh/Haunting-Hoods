import React from 'react';
import './CheckerPage.css';

const MINT_LINK = 'https://opensea.io/collection/haunting-hoods-4444/overview';

export default function CheckerPage() {
	return (
		<div className="checker-page">
			<header className="landing-nav">
				<a className="landing-brand" href="/">
					<img src="/images/new-logo.png" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="/lore">LORE</a>
					<a href="/utility">UTILITY</a>
				</nav>
				<button className="menu-button" aria-label="Open menu">☰</button>
			</header>

			<main className="checker-main">
				<div className="checker-container">
					<div className="checker-header">
						<p className="eyebrow">OFFICIAL CHECKER IS LIVE</p>
						<h2>THE SEAL HAS BROKEN.</h2>
						<p className="checker-subtitle">
							Eligibility checks are closed. The 4444 Haunting Hoods are now live on OpenSea. Claim your Hood now.
						</p>
					</div>

					<div className="checker-input-section">
						<a
							href={MINT_LINK}
							target="_blank"
							rel="noopener noreferrer"
							className="checker-btn"
							style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
						>
							CHECK ON OPENSEA
						</a>
					</div>
				</div>
			</main>

			<footer className="landing-footer">
				<span>© 2026 HAUNTING HOODS. ALL RIGHTS RESERVED.</span>
				<span><a href="https://x.com/Haunting_Hoods" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>X (TWITTER)</a></span>
				<span>TERMS　　PRIVACY</span>
			</footer>
		</div>
	);
}
