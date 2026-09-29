import { useState } from 'react';
import './WhitelistApplication.css';
import { submitRefundAddress } from '../../../supabase/refundService';

export default function WhitelistApplication() {
	const [formData, setFormData] = useState({
		xUsername: '',
		activityWallet: '',
		transactionHashes: '',
		compensationWallet: ''
	});
	const [submitted, setSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.xUsername || !formData.activityWallet || !formData.transactionHashes || !formData.compensationWallet) return;

		setIsSubmitting(true);
		setError(null);

		const result = await submitRefundAddress(formData);
		
		if (result.success) {
			setSubmitted(true);
		} else {
			setError('Failed to submit form. Please try again.');
		}
		
		setIsSubmitting(false);
	};

	return (
		<section className="wl-application-section" id="whitelist">
			<div className="wl-app-container seal-breaking-container">
				<div className="seal-breaking-eyebrow">THE PACT REMAINS</div>
				<h2 className="seal-breaking-title">RECLAIM YOUR TRIBUTE</h2>
				<p className="seal-breaking-subtitle loss-form-subtitle" style={{ maxWidth: '600px' }}>
					The Hoods do not forget their own. Your devotion shall not lead to ruin. Provide the sacred details below so we may accurately trace your path.
				</p>

				{!submitted ? (
					<form onSubmit={handleSubmit} className="whitelist-form loss-verification-form">
						<div className="form-group wl-address-input-group">
							<label className="wl-address-label">
								<strong>1. TRIBUTE IDENTITY</strong>
								<span>Your X/Twitter username</span>
							</label>
							<input
								type="text"
								name="xUsername"
								className="wl-address-input"
								placeholder="@username"
								value={formData.xUsername}
								onChange={handleChange}
								required
								disabled={isSubmitting}
								style={{ textAlign: 'left', marginTop: '0' }}
							/>
						</div>

						<div className="form-group wl-address-input-group">
							<label className="wl-address-label">
								<strong>2. THE SACRED WALLET</strong>
								<span>Wallet address used to mint/buy/sell Haunting Hoods</span>
							</label>
							<input
								type="text"
								name="activityWallet"
								className="wl-address-input"
								placeholder="0x..."
								value={formData.activityWallet}
								onChange={handleChange}
								required
								disabled={isSubmitting}
								style={{ textAlign: 'left', marginTop: '0' }}
							/>
						</div>

						<div className="form-group wl-address-input-group">
							<label className="wl-address-label">
								<strong>3. PROOFS OF DEVOTION</strong>
								<span>Please provide ALL relevant transaction hashes. This can include mint, buy, and sell transactions.</span>
								<span style={{ fontStyle: 'italic', color: '#ff4d4d', opacity: 0.8, marginTop: '0.5rem' }}>
									« You can submit multiple transaction hashes. Please enter one transaction hash per line. »
								</span>
							</label>
							<textarea
								name="transactionHashes"
								className="wl-address-input wl-textarea"
								placeholder="Transaction Hash 1:&#10;Transaction Hash 2:&#10;Transaction Hash 3:&#10;Transaction Hash 4:"
								value={formData.transactionHashes}
								onChange={handleChange}
								required
								disabled={isSubmitting}
								rows="5"
								style={{ textAlign: 'left', marginTop: '0', background: 'transparent' }}
							/>
						</div>

						<div className="form-group wl-address-input-group">
							<label className="wl-address-label">
								<strong>4. THE RECEPTACLE</strong>
								<span>Wallet address where you want your relaunch compensation/rewards sent</span>
							</label>
							<input
								type="text"
								name="compensationWallet"
								className="wl-address-input"
								placeholder="0x..."
								value={formData.compensationWallet}
								onChange={handleChange}
								required
								disabled={isSubmitting}
								style={{ textAlign: 'left', marginTop: '0' }}
							/>
							<p className="form-warning" style={{ fontSize: '0.75rem', marginTop: '0.8rem', letterSpacing: '0.05em' }}>⚠️ PLEASE DOUBLE-CHECK THIS ADDRESS BEFORE SUBMITTING.</p>
						</div>

						{error && <p className="form-error-message">{error}</p>}
						
						<button type="submit" className="wl-submit-btn mint-btn" disabled={isSubmitting}>
							{isSubmitting ? 'SUMMONING...' : 'RECLAIM TRIBUTE'}
						</button>
					</form>
				) : (
					<div className="wl-success-message" style={{ marginTop: '2rem' }}>
						<h3 style={{ color: '#ff4d4d', letterSpacing: '0.1em' }}>TRIBUTE RECEIVED</h3>
						<p style={{ color: '#888', fontSize: '0.9rem' }}>Your devotion is recognized. We will review your path and honor your loyalty.</p>
					</div>
				)}
			</div>
		</section>
	);
}
