import './WhitelistApplication.css';

const MINT_LINK = 'https://opensea.io/collection/haunting-hoods-4444/overview';

export default function WhitelistApplication() {
	return (
		<section className="wl-application-section" id="whitelist">
			<div className="wl-app-container seal-breaking-container">
				<div className="seal-breaking-eyebrow">THE SANCTUM OPENS</div>
				<h2 className="seal-breaking-title">THE SEAL IS BREAKING.</h2>
				<p className="seal-breaking-subtitle">
					The 4444 have waited long enough. The veil is tearing.<br />
					Step through. Claim your Hood.
				</p>

				<div className="seal-breaking-glyph" aria-hidden="true">
					<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="100" cy="100" r="90" stroke="#ff4d4d" strokeWidth="0.5" strokeDasharray="4 6" className="rotate-slow"/>
						<circle cx="100" cy="100" r="65" stroke="#ff4d4d" strokeWidth="0.3" strokeDasharray="2 8" className="rotate-reverse"/>
						<circle cx="100" cy="100" r="40" stroke="#ff4d4d" strokeWidth="0.5" opacity="0.5"/>
						<path d="M100 10 L110 55 L155 40 L125 75 L165 90 L120 100 L155 125 L110 120 L100 165 L90 120 L45 125 L80 100 L35 90 L75 75 L45 40 L90 55 Z" stroke="#ff4d4d" strokeWidth="0.5" fill="none" opacity="0.4"/>
						<circle cx="100" cy="100" r="4" fill="#ff4d4d" opacity="0.8"/>
					</svg>
				</div>

				<a
					href={MINT_LINK}
					target="_blank"
					rel="noopener noreferrer"
					className="wl-submit-btn mint-btn"
				>
					MINT ON OPENSEA
				</a>

				<p className="seal-breaking-note">
					Live now on OpenSea — 4444 Haunting Hoods
				</p>
			</div>
		</section>
	);
}
