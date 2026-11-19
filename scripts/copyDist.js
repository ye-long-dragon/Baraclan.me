import fs from 'node:fs';

if (fs.existsSync('dist')) {
  fs.cpSync('dist', 'client/dist', { recursive: true });
}
