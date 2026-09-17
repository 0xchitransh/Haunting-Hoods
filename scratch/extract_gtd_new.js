const fs = require('fs');
const path = require('path');

const csvPath = '/Users/chitranshraj/haunting hoodz.worktrees/run-code-execution/scratch/GTD-wallets-hh-16-sept.csv';
const outPath = '/Users/chitranshraj/haunting hoodz.worktrees/run-code-execution/src/data/gtd_wallets.json';

const content = fs.readFileSync(csvPath, 'utf-8');
const regex = /0x[a-fA-F0-9]{40}/g;
const matches = content.match(regex) || [];
const unique = [...new Set(matches.map(a => a.toLowerCase()))];

fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));
console.log(`Extracted ${unique.length} unique GTD wallets from ${csvPath}`);
