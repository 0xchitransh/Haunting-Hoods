const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const privateKey = process.env.FIREBASE_PRIVATE_KEY
	? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
	: undefined;

if (!privateKey) {
	console.error('Missing FIREBASE_PRIVATE_KEY');
	process.exit(1);
}

initializeApp({
	credential: cert({
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: privateKey,
	}),
});

const db = getFirestore();

async function createCollection() {
	try {
		console.log('Creating dummy document in mark_verifications...');
		const docRef = db.collection('mark_verifications').doc('DUMMY_DOC');
		await docRef.set({
			markCode: 'DUMMY',
			discordUser: 'dummy#1234',
			twitterHandle: 'dummy',
			tweetUrl: 'https://x.com/dummy',
			walletAddress: '0xdummy',
			status: 'PENDING',
			createdAt: FieldValue.serverTimestamp()
		});
		console.log('Successfully created dummy document. You can now see mark_verifications in your Firebase Console.');
		process.exit(0);
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

createCollection();
