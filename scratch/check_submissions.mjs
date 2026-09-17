import { config } from 'dotenv';
import admin from 'firebase-admin';

config({ path: '.env.local' });

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	}),
});

const db = admin.firestore();

async function checkSubmissions() {
	const collections = await db.listCollections();
	console.log("Collections:", collections.map(c => c.id));

	const date = new Date('2026-09-05T15:00:00Z'); // Sept 5 8:30 PM IST
	console.log(`Checking submissions after: ${date.toISOString()} (IST 8:30 PM)`);

	for (const collection of collections) {
		const snapshot = await collection.where('createdAt', '>', date).get();
		console.log(`- ${collection.id}: ${snapshot.size} submissions`);
	}
}

checkSubmissions().catch(console.error).finally(() => process.exit(0));
