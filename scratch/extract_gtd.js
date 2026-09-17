const fs = require('fs');
const path = require('path');

const transcriptPath = '/Users/chitranshraj/.gemini/antigravity-ide/brain/f5609d02-dfe7-4ce1-9577-fc8cd81e5b70/.system_generated/logs/transcript_full.jsonl';
const outPath = path.join(__dirname, '../src/data/gtd_wallets.json');

const lines = fs.readFileSync(transcriptPath, 'utf-8').trim().split('\n');
const latestUserMessage = lines.reverse().find(line => {
    try {
        const obj = JSON.parse(line);
        return obj.type === 'USER_INPUT' && obj.content.includes('these are all wallets eligible for gtd');
    } catch (e) {
        return false;
    }
});

if (latestUserMessage) {
    const obj = JSON.parse(latestUserMessage);
    const content = obj.content;
    const regex = /0x[a-fA-F0-9]{40}/g;
    const matches = content.match(regex) || [];
    const unique = [...new Set(matches.map(a => a.toLowerCase()))];
    
    // Ensure the data directory exists
    const dataDir = path.dirname(outPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));
    console.log(`Successfully extracted ${unique.length} GTD wallets to ${outPath}`);
} else {
    console.log('Failed to find user message with GTD wallets.');
}
