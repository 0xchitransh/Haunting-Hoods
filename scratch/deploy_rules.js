const { initializeApp, cert } = require('firebase-admin/app');
const { getSecurityRules } = require('firebase-admin/security-rules');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const privateKey = process.env.FIREBASE_PRIVATE_KEY
	? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
	: undefined;

if (!privateKey) {
	console.error('Missing FIREBASE_PRIVATE_KEY');
	process.exit(1);
}

const app = initializeApp({
	credential: cert({
		projectId: process.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: privateKey,
	}),
});

async function deployRules() {
	try {
		const source = fs.readFileSync('firestore.rules', 'utf8');
		const securityRules = getSecurityRules(app);
		
		console.log('Creating ruleset...');
		const ruleset = await securityRules.createRuleset({
		    source: {
		        files: [{
		            name: 'firestore.rules',
		            content: source
		        }]
		    }
		});
		
		console.log('Releasing ruleset...');
		await securityRules.releaseFirestoreRuleset(ruleset.name);
		
		console.log('Successfully deployed firestore.rules!');
		process.exit(0);
	} catch (error) {
		console.error('Error deploying rules:', error);
		process.exit(1);
	}
}

deployRules();
