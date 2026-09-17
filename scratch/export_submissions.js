const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const privateKey = process.env.FIREBASE_PRIVATE_KEY
	? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
	: undefined;

if (!privateKey) {
	console.error('Missing FIREBASE_PRIVATE_KEY in .env.local');
	process.exit(1);
}

// Initialize Firebase Admin
initializeApp({
	credential: cert({
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: privateKey,
	}),
});

const db = getFirestore();

// Helper to convert Firestore timestamp to readable date string
function formatTimestamp(timestamp) {
	if (!timestamp) return '';
	if (typeof timestamp.toDate === 'function') {
		return timestamp.toDate().toISOString();
	}
	if (timestamp._seconds) {
		return new Date(timestamp._seconds * 1000).toISOString();
	}
	return String(timestamp);
}

// Escape CSV field
function escapeCSV(val) {
	if (val === null || val === undefined) return '""';
	const str = String(val).replace(/"/g, '""');
	return `"${str}"`;
}

async function exportCollection(collectionName, fields, outputFile) {
	console.log(`Exporting ${collectionName}...`);
	try {
		const snapshot = await db.collection(collectionName).get();
		
		if (snapshot.empty) {
			console.log(`No documents found in ${collectionName}.`);
			fs.writeFileSync(outputFile, 'No data\n');
			return;
		}

		// Write CSV Header
		const header = fields.join(',');
		let csvContent = header + '\n';

		let count = 0;
		snapshot.forEach(doc => {
			const data = doc.data();
			
			// Format timestamp if present
			if (data.createdAt) {
				data.createdAt = formatTimestamp(data.createdAt);
			}

			// Map fields to CSV row
			const row = fields.map(field => escapeCSV(data[field])).join(',');
			csvContent += row + '\n';
			count++;
		});

		fs.writeFileSync(outputFile, csvContent);
		console.log(`Successfully exported ${count} records to ${outputFile}`);
	} catch (error) {
		console.error(`Error exporting ${collectionName}:`, error);
	}
}

async function main() {
	// Fields to export for whitelist_claims
	const whitelistFields = [
		'claimNumber',
		'discordUser',
		'twitterHandle',
		'walletAddress',
		'quoteTweetLink',
		'uid',
		'campaignId',
		'createdAt'
	];
	
	// Fields to export for mark_verifications
	const markFields = [
		'markCode',
		'discordUser',
		'twitterHandle',
		'walletAddress',
		'tweetUrl',
		'status',
		'createdAt'
	];

	await exportCollection('whitelist_claims', whitelistFields, path.join(__dirname, 'whitelist_claims_export.csv'));
	await exportCollection('mark_verifications', markFields, path.join(__dirname, 'mark_verifications_export.csv'));
	
	console.log('Export complete! You can find the CSV files in the scratch/ folder.');
	process.exit(0);
}

main();
