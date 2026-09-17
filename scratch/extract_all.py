import json
import re

transcript_path = '/Users/chitranshraj/.gemini/antigravity-ide/brain/f5609d02-dfe7-4ce1-9577-fc8cd81e5b70/.system_generated/logs/transcript_full.jsonl'

wallets = set()

# Regular expression for a 0x-prefixed 40-character hex string (total length 42)
wallet_regex = re.compile(r'0x[a-fA-F0-9]{40}')

try:
    with open(transcript_path, 'r') as f:
        for line in f:
            try:
                obj = json.loads(line)
                if obj.get('type') == 'USER_INPUT':
                    content = obj.get('content', '')
                    matches = wallet_regex.findall(content)
                    for match in matches:
                        wallets.add(match.lower())
            except json.JSONDecodeError:
                continue

    out_path = '/Users/chitranshraj/haunting hoodz.worktrees/run-code-execution/src/data/gtd_wallets.json'
    with open(out_path, 'w') as f:
        json.dump(list(wallets), f, indent=2)

    print(f"Extracted {len(wallets)} unique GTD wallets.")

except Exception as e:
    print(f"Error: {e}")
