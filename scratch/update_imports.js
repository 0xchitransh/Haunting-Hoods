const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');
	let modified = false;

	if (content.includes('firebase/')) {
		// Replace imports from firebase
		content = content.replace(/from\s+['"]([^'"]*?)firebase\/([^'"]+)['"]/g, "from '$1supabase/$2'");
		content = content.replace(/import\s*\(\s*['"]([^'"]*?)firebase\/([^'"]+)['"]\s*\)/g, "import('$1supabase/$2')");
		modified = true;
	}
	
	if (content.includes('probeFirestoreReachability')) {
		content = content.replace(/probeFirestoreReachability/g, 'probeSupabaseReachability');
		modified = true;
	}
	
	if (content.includes('setFirestoreReachable')) {
		// If there is any reference, we'll keep it as is or change it to Supabase
		// Let's change setFirestoreReachable to setSupabaseReachable in App.jsx if it exists
		content = content.replace(/setFirestoreReachable/g, 'setSupabaseReachable');
		modified = true;
	}

	if (modified) {
		fs.writeFileSync(filePath, content, 'utf8');
		console.log(`Updated ${filePath}`);
	}
}

function traverseDir(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			traverseDir(fullPath);
		} else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
			replaceInFile(fullPath);
		}
	}
}

traverseDir(path.join(__dirname, '../src'));
