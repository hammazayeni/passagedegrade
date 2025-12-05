import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

try {
  execSync('npm run build', { stdio: 'inherit' });

  if (!fs.existsSync(dist)) {
    throw new Error('dist folder not found after build');
  }

  const devIndexPath = path.join(root, 'index.html');
  const hasDevIndex = fs.existsSync(devIndexPath) ? fs.readFileSync(devIndexPath, 'utf8') : null;

  copyDir(dist, root);

  const index404 = path.join(root, '404.html');
  fs.copyFileSync(path.join(dist, 'index.html'), index404);

  const nojekyll = path.join(root, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    fs.writeFileSync(nojekyll, '');
  }

  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "pages: publish build to main/root"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });

  if (hasDevIndex) {
    fs.writeFileSync(devIndexPath, hasDevIndex);
    console.log('Restored local dev index.html for development');
  }

  console.log('Published build to main/root. Configure GitHub Pages: main /root.');
} catch (err) {
  console.error(err);
  process.exit(1);
}
