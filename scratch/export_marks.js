const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Load environment variables
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
	const match = line.match(/^([^=]+)=(.*)$/);
	if (match) {
		let key = match[1];
		let val = match[2];
		if (val.startsWith('"') && val.endsWith('"')) {
			val = val.slice(1, -1);
		}
		process.env[key] = val;
	}
});

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

initializeApp({
	credential: cert({
		projectId: 'haunting-hoods-b4882',
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: privateKey,
	}),
});

const db = getFirestore();

async function exportMarks() {
	console.log('Fetching all documents from mark_verifications...');
	const snapshot = await db.collection('mark_verifications').get();
	
	let rows = ['id,wallet,twitter,discord,timestamp'];
	
	snapshot.forEach(doc => {
		const data = doc.data();
		const wallet = data.walletAddress || data.wallet || '';
		const twitter = data.twitterHandle || data.twitterUser || data.twitter || data.user_name || '';
		const discord = data.discordUser || data.discord || '';
		const timestamp = data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate().toISOString() : data.timestamp) : (data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : '');
		
		rows.push(`${doc.id},"${wallet}","${twitter}","${discord}","${timestamp}"`);
	});
	
	const csvData = rows.join('\n');
	fs.writeFileSync('scratch/all_mark_verifications.csv', csvData);
	console.log(`Exported ${snapshot.size} records to scratch/all_mark_verifications.csv`);
}

exportMarks().catch(console.error).finally(() => process.exit(0));
