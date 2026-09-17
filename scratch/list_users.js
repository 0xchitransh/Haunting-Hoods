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

async function listUsers() {
	console.log("--- Whitelist Applications ---");
	const claimsSnap = await db.collection('whitelist_claims').orderBy('createdAt', 'desc').get();
	if (claimsSnap.empty) {
		console.log("No one has applied for the whitelist yet.");
	} else {
		claimsSnap.forEach(doc => {
			const data = doc.data();
			console.log(`- Twitter: @${data.twitterHandle} | Wallet: ${data.walletAddress} | Spot: #${data.claimNumber}`);
		});
	}
	
	console.log("\n--- Discord Raffle Entries ---");
	const raffleSnap = await db.collection('raffle_entries').orderBy('createdAt', 'desc').get();
	if (raffleSnap.empty) {
		console.log("No one has entered the Discord raffle yet.");
	} else {
		raffleSnap.forEach(doc => {
			const data = doc.data();
			console.log(`- Discord: ${data.discordUsername} | Wallet: ${data.walletAddress}`);
		});
	}
}

listUsers().catch(console.error).finally(() => process.exit(0));
