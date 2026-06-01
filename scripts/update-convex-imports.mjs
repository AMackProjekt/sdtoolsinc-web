import fs from 'fs';
import path from 'path';

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      files.push(...walk(full));
    } else if (/\.tsx?$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const root = process.cwd();
const files = walk(root);
let updated = 0;
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  let out = src
    // Replace relative convex api/dataModel imports like ../../convex/_generated/api
    .replace(/(["'`])((?:\.\.\/)+)convex\/_generated\/(api|dataModel)\1/g, "'@/convex/_generated/$3'")
    // Replace odd @/../convex patterns
    .replace(/(["'`])@\/\.{2}\/convex\/_generated\/(api|dataModel)\1/g, "'@/convex/_generated/$2'")
    // Replace any absolute-like ../convex/_generated/... without quotes captured previously
    .replace(/convex\/_generated\/(api|dataModel)/g, "@/convex/_generated/$1");

  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    updated++;
  }
}
console.log(`Updated ${updated} files.`);
process.exit(0);
