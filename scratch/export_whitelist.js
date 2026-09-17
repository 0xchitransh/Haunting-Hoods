const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('/Users/chitranshraj/Downloads/haunting-hoods-firebase-adminsdk-fbsvc-4fc60e2eb1.json');

initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

async function exportSubmissions() {
	console.log('Fetching all documents from whitelist_claims...');
	const snapshot = await db.collection('whitelist_claims').get();
	
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
	fs.writeFileSync('scratch/all_whitelist_claims.csv', csvData);
	console.log(`Exported ${snapshot.size} records to scratch/all_whitelist_claims.csv`);
}

exportSubmissions().catch(console.error).finally(() => process.exit(0));
