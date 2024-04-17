import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

const __cwd = process.cwd();

export default async function defaultHandler(ctx) {
  const indexFilePath = path.join(__cwd, '/src/ui/index.ejs');
  if(fs.existsSync(indexFilePath)) {
    const indexFile = fs.readFileSync(indexFilePath, 'utf-8');
    ctx.set('Content-Type', 'text/html');
    ctx.body = await ejs.render(indexFile);
  }
}
