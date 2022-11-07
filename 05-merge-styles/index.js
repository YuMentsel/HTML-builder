const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const stylesPath =  path.join(path.join(__dirname, 'styles'));
const bundlePath =  path.join(path.join(__dirname, 'project-dist', 'bundle.css'));
const output = fs.createWriteStream(bundlePath);

async function createBundle() {
  const files = await fsPromises.readdir(stylesPath, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
      const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf8');
      input.on('data', data => output.write(data + '\n'));
    }
  })
}

createBundle();
