import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all_supabase_wiki_articles.json', 'utf-8'));

console.log('Total articles:', data.length);

const categories = {};
data.forEach(item => {
  categories[item.category] = (categories[item.category] || 0) + 1;
});
console.log('Categories count:', categories);

console.log('\n--- ARTICLE AUDIT ---');
data.forEach((item, index) => {
  const missing = [];
  if (!item.title_tr) missing.push('title_tr');
  if (!item.title_en) missing.push('title_en');
  if (!item.short_desc_tr) missing.push('short_desc_tr');
  if (!item.short_desc_en) missing.push('short_desc_en');
  if (!item.content_tr || item.content_tr.length < 20) missing.push('content_tr');
  if (!item.content_en || item.content_en.length < 20) missing.push('content_en');
  
  const hasImage = !!item.image_url;

  console.log(`${index + 1}. [${item.category}] TR: "${item.title_tr}" | EN: "${item.title_en}" | Image: ${hasImage ? 'YES' : 'NO'} | Missing: [${missing.join(', ')}]`);
});
