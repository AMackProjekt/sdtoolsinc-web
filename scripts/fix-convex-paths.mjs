import fs from 'fs';
import path from 'path';
function walk(dir){
  const files = [];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const full=path.join(dir,entry.name); if(entry.isDirectory()){ if(entry.name==='node_modules'||entry.name==='.next'||entry.name==='.git') continue; files.push(...walk(full)); } else if(/\.tsx?$/.test(entry.name)){ files.push(full); }} return files; }
const root=process.cwd();
let files=walk(root); let updated=0;
for(const file of files){ let s=fs.readFileSync(file,'utf8'); let o=s.replace(/@\/@\/convex/g, '@/convex').replace(/@\/\.\.\/convex/g, '@/convex'); if(o!==s){ fs.writeFileSync(file,o,'utf8'); updated++; }}
console.log('Fixed', updated, 'files');
process.exit(0);
