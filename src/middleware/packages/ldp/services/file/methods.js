const fs = require('fs');

// TODO put each method in a different file (problems with "this" not working)
module.exports = {
  async streamToFile(inputStream, filePath) {
    return new Promise((resolve, reject) => {
      const fileWriteStream = fs.createWriteStream(filePath);
      inputStream
        .pipe(fileWriteStream)
        .on('finish', resolve)
        .on('error', reject);
    });
  }
};
