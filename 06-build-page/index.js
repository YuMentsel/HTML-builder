const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');

const stylesOutput = fs.createWriteStream(path.join(dirPath, 'style.css'));

let assetsPath = path.join(__dirname, 'assets');
let distAssetsPath = path.join(dirPath, 'assets');

const makeFolder = async () => fsPromises.mkdir(dirPath, { recursive: true });
const readTemplate = async () => fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

const createHTMLFile = async (template) => {
  let files = await fsPromises.readdir(componentsPath, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile() && path.extname(path.join(componentsPath, file.name)) === '.html') {
      let component = await fsPromises.readFile(path.join(componentsPath, file.name), 'utf-8');
      template = await template.replace(`  {{${file.name.split('.')[0]}}}`, component);
    }
  }
  fsPromises.writeFile(path.join(dirPath, 'index.html'), template);
}

async function createCSSFile() {
  const files = await fsPromises.readdir(stylesPath, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
      const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf8');
      input.on('data', data => stylesOutput.write(data + '\n'));
    }
  })
}

async function copyDir(assetsPath, distAssetsPath, file) {
  let subAssetsPath = path.join(assetsPath, file.name);
  let subDistAssetsPath = path.join(distAssetsPath, file.name);
  await copyAssets(subAssetsPath, subDistAssetsPath);
}

async function copyFile(assetsPath, distAssetsPath, file) {
  await fsPromises.copyFile(path.join(assetsPath, file.name), path.join(distAssetsPath, file.name));
}

async function copyAssets(assetsPath, distAssetsPath) {
  await fsPromises.rm(distAssetsPath, { force: true, recursive: true });
  await fsPromises.mkdir(distAssetsPath);
  let dir = await fsPromises.readdir(assetsPath, { withFileTypes: true });
  dir.forEach( file => {
    if (file.isDirectory()) copyDir(assetsPath, distAssetsPath, file);
    if (file.isFile()) copyFile(assetsPath, distAssetsPath, file);
  });
}

async function createPage() {
  await makeFolder();
  let template = await readTemplate();
  createHTMLFile(template);
  createCSSFile();
  copyAssets(assetsPath, distAssetsPath);
}

createPage();
