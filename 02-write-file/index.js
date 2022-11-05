const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const textFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(textFile);

stdout.write('Hello! Enter the text.\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  output.write(data);
  stdout.write(`${data.toString().trim()} was added!\n`);
});

process.on('exit', () => stdout.write('Goodbye! Have a good day!'));
process.on('SIGINT', () => process.exit());
