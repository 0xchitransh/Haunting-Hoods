import React, { useState } from 'react';
import './CheckerPage.css';

import gtdWallets from '../../../data/gtd_wallets.json';
import fcfsWallets from '../../../data/fcfs_wallets.json';

const GTD_WALLETS = gtdWallets;
const FCFS_WALLETS = fcfsWallets;

export default function CheckerPage() {
	const [address, setAddress] = useState('');
	const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, RESULT
	const [loadingStep, setLoadingStep] = useState(0);
	const [result, setResult] = useState(null);

	const loadingSteps = [
		"INITIATING SANCTUM CONNECTION...",
		"DECRYPTING PREVIOUS SEALS...",
		"QUERYING THE ANCIENT RECORDS...",
		"EXTRACTING WALLET SIGNATURE..."
	];

	const handleCheck = () => {
		if (!address || !address.trim() || !address.startsWith('0x')) return;

		setStatus('LOADING');
		setLoadingStep(0);
		setResult(null);

		// Animate loading steps
		let step = 0;
		const interval = setInterval(() => {
			step++;
			if (step < loadingSteps.length) {
				setLoadingStep(step);
			} else {
				clearInterval(interval);
				verifyEligibility();
			}
		}, 800); // 800ms per step
	};

	const verifyEligibility = () => {
		const formattedAddress = address.trim().toLowerCase();
		
		if (GTD_WALLETS.includes(formattedAddress)) {
			setResult({ type: 'GTD', message: 'GUARANTEED WHITELIST CONFIRMED' });
		} else if (FCFS_WALLETS.includes(formattedAddress)) {
			setResult({ type: 'FCFS', message: 'FIRST COME FIRST SERVE CONFIRMED' });
		} else {
			setResult({ type: 'NONE', message: 'NO RECORD FOUND IN THE ARCHIVES' });
		}
		
		setStatus('RESULT');
	};

	return (
		<div className="checker-page">
			<header className="landing-nav">
				<a className="landing-brand" href="/">
					<img src="/images/new-logo.png" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="/lore">LORE</a>
					<a href="/utility">UTILITY</a>
					<a href="/checker">CHECK ELIGIBILITY</a>
				</nav>
				<button className="menu-button" aria-label="Open menu">☰</button>
			</header>

			<main className="checker-main">
				<div className="checker-container">
					<div className="checker-header">
						<p className="eyebrow">VERIFICATION</p>
						<h2>ELIGIBILITY CHECKER</h2>
						<p className="checker-subtitle">
							Enter your wallet address below to search the Sanctum records for previous event allocations (Sigil, Seal Breaking, Whitelist Campaign).
						</p>
					</div>

					<div className="checker-input-section">
						<input
							type="text"
							className="checker-input"
							placeholder="Paste 0x address..."
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							disabled={status === 'LOADING'}
						/>
						
						{status === 'IDLE' && (
							<button 
								className="checker-btn" 
								onClick={handleCheck}
								disabled={!address.trim() || !address.startsWith('0x')}
							>
								VERIFY
							</button>
						)}

						{status === 'LOADING' && (
							<div className="checker-loading">
								<span className="loading-spinner"></span>
								<p className="loading-text">{loadingSteps[loadingStep]}</p>
							</div>
						)}

						{status === 'RESULT' && result && (
							<div className={`checker-result ${result.type.toLowerCase()}`}>
								<h3>{result.type === 'NONE' ? 'NOT ELIGIBLE' : `${result.type} ELIGIBLE`}</h3>
								<p>{result.message}</p>
								<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
									{result.type === 'NONE' && (
										<a 
											href="/#whitelist" 
											className="checker-btn" 
											style={{ textDecoration: 'none', display: 'inline-block', backgroundColor: 'rgba(255, 77, 77, 0.1)', borderColor: '#ff4d4d', color: '#ff4d4d', marginTop: '1rem', padding: '1rem', fontSize: '0.8rem' }}
										>
											GRAB YOUR LAST CHANCE
										</a>
									)}
									<button className="checker-btn retry" onClick={() => {
										setStatus('IDLE');
										setAddress('');
										setResult(null);
									}}>
										CHECK ANOTHER
									</button>
								</div>
							</div>
						)}
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
