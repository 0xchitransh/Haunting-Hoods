import { useState } from 'react';
import './WhitelistApplication.css';
import { submitRefundAddress } from '../../../supabase/refundService';

export default function WhitelistApplication() {
	const [address, setAddress] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!address.trim()) return;

		setIsSubmitting(true);
		setError(null);

		const result = await submitRefundAddress(address.trim());
		
		if (result.success) {
			setSubmitted(true);
		} else {
			setError('Failed to submit address. Please try again.');
		}
		
		setIsSubmitting(false);
	};

	return (
		<section className="wl-application-section" id="whitelist">
			<div className="wl-app-container seal-breaking-container">
				<div className="seal-breaking-eyebrow">THE PACT REMAINS</div>
				<h2 className="seal-breaking-title">SUBMIT YOUR ADDRESS</h2>
				<p className="seal-breaking-subtitle">
					The Hoods do not forget their own. Your devotion shall not lead to ruin. <br />
					Provide your wallet address to reclaim your tribute.
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

				{!submitted ? (
					<form onSubmit={handleSubmit} className="whitelist-form" style={{ marginTop: '2rem' }}>
						<input
							type="text"
							className="wl-address-input"
							placeholder="Enter your ETH address..."
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
							disabled={isSubmitting}
							style={{ textAlign: 'center' }}
						/>
						{error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '1rem' }}>{error}</p>}
						<button type="submit" className="wl-submit-btn mint-btn" style={{ marginTop: '2rem', width: '100%' }} disabled={isSubmitting}>
							{isSubmitting ? 'SUBMITTING...' : 'SUBMIT ADDRESS'}
						</button>
					</form>
				) : (
					<div className="wl-success-message" style={{ marginTop: '2rem' }}>
						<h3 style={{ color: '#ff4d4d', letterSpacing: '0.1em' }}>ADDRESS RECEIVED</h3>
						<p style={{ color: '#888', fontSize: '0.9rem' }}>Your tribute will be returned to you.</p>
					</div>
				)}
			</div>
		</section>
	);
}
