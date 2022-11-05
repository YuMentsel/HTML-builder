const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

let dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(dirPath, file.name), (err, stat) => {
        if (err) throw err;
        stdout.write(`${file.name.split('.')[0]} - ${path.extname(path.join(dirPath, file.name)).slice(1)} - ${stat.size}B\n`);
      })
    }
  })
})
