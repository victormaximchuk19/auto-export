const indexFile = 'index';

const fs = require('fs');
const path = require('path');

const getFileName = (file) => path.basename(file, path.extname(file));

const exclude = (excludes) => (file) => (
  file !== indexFile && !excludes.includes(file)
);

const exportFile = (exports, dirName) => (file) => (
  exports[file] = require(path.join(dirName, file))
);

const validateDirName = (dirName) => {
  const isValid = fs.statSync(dirName).isDirectory();

  if (isValid) {
    return true;
  }

  throw new Error('Invalid directory name.');
};

const autoExport = (dir = path.dirname(module.parent.filename), excludes = []) => {
  try {
    validateDirName(dir);

    const exports = {};

    fs.readdirSync(dir)
      .map(getFileName)
      .filter(exclude(excludes))
      .forEach(exportFile(exports, dir)); 

    return exports;
  } catch (ex) {
    console.error(ex);
  }
};

module.exports = autoExport;
