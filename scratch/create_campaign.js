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

async function initCampaign() {
	const campaignRef = db.collection('whitelist_campaigns').doc('active-campaign');
	const doc = await campaignRef.get();
	
	if (!doc.exists) {
		console.log("Creating active-campaign...");
		await campaignRef.set({
			id: 'active-campaign',
			code: 'HAUNTED',
			slotsTotal: 4444,
			claimedCount: 0,
			active: true,
		});
		console.log("Success! active-campaign created.");
	} else {
		console.log("active-campaign already exists.");
	}
}

initCampaign().catch(console.error).finally(() => process.exit(0));
