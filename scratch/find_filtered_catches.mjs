import fs from 'fs';
const content = fs.readFileSync('components/community/CommunityClient.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('filteredCatches') || line.includes('displayedCatches')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
