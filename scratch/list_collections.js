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

async function listCollections() {
	console.log('Listing all collections in haunting-hoods-b4882...');
	const collections = await db.listCollections();
	for (const collection of collections) {
		console.log(`- ${collection.id}`);
		const snapshot = await collection.limit(1).get();
		console.log(`  (Sample doc count: ${snapshot.size > 0 ? 'Not Empty' : 'Empty'})`);
		const fullSnapshot = await collection.get();
		console.log(`  (Total docs: ${fullSnapshot.size})`);
	}
}

listCollections().catch(console.error).finally(() => process.exit(0));
