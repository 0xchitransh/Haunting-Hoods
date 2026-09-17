const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: privateKey,
	}),
});

const db = getFirestore();

async function checkSubmissions() {
	const date = new Date('2026-09-05T15:00:00Z');
	
	const snapshot = await db.collection('whitelist_claims')
		.where('timestamp', '>', date)
		.get();
		
	let count = 0;
	if (!snapshot.empty) {
		count = snapshot.size;
	} else {
		// check if they use createdAt instead of timestamp
		const snap2 = await db.collection('whitelist_claims')
			.where('createdAt', '>', date)
			.get();
		count = snap2.size;
	}
	
	console.log(`Submissions in whitelist_claims after Sept 5 8:30 PM IST: ${count}`);
}

checkSubmissions().catch(console.error).finally(() => process.exit(0));
