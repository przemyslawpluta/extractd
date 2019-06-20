const fs = require('fs');
const util = require('util');
const stream = require('stream');
const extractd = require('../extractd');

const pipeline = util.promisify(stream.pipeline);

(async () => {

    const done = await extractd.generate('nikon_d850_01.nef', {
        stream: true
    });

    await pipeline(done.preview, fs.createWriteStream('nikon_d850_01.jpg'));

})();