const fs = require('fs');
const path = require('path');

const stylesPath =  path.join(path.join(__dirname, 'styles'));
const bundlePath =  path.join(path.join(__dirname, 'project-dist', 'bundle.css'));
const output = fs.createWriteStream(bundlePath, 'utf-8');

fs.promises.readdir(stylesPath, { withFileTypes: true })
.then (files => files.forEach(file => {
  if (file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
    const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf8');
    input.pipe(output);
  }
}));
