const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

let dirPath = path.join(__dirname, 'files');
let newDirPath = path.join(__dirname, 'files-copy');

// Async/await (это не SYNC!) /////////////////////////

async function copyDir() {
  await fsPromises.rm(newDirPath, { force: true, recursive: true });
  await fsPromises.mkdir(newDirPath);
  let dir = await fsPromises.readdir(dirPath, { withFileTypes: true });
  dir.forEach( file => {
    if (file.isFile()) {
      fs.copyFile(path.join(dirPath, file.name), path.join(newDirPath, file.name), err => { if (err) throw err });
    }
  });
};

copyDir();

// callback /////////////////////////////////////////////

// const fs = require('fs');
// const path = require('path');

// let dirPath = path.join(__dirname, 'files');
// let newDirPath = path.join(__dirname, 'files-copy');

// function copyDir() {
//   fs.rm(newDirPath, { force: true, recursive: true }, err => {
//     if(err) throw err;
//     fs.mkdir(newDirPath, err => {
//       if(err) throw err;
//       fs.readdir(dirPath, { withFileTypes: true }, (err, dir) => {
//         if (err) throw err;
//         dir.forEach( file => {
//           if (file.isFile()) {
//             fs.copyFile(path.join(dirPath, file.name), path.join(newDirPath, file.name), err => {
//               if (err) throw err;
//             });
//           };
//         });
//       });
//     });
//   });
// }

// copyDir();
